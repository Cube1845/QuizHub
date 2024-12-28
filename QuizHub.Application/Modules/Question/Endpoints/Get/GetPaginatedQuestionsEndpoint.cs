using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Get;

public class GetPaginatedQuestionsEndpoint(IAppDbContext context) : IdentifiedEndpoint<GetPaginatedQuestionsRequest, Result<GetPaginatedQuestionsResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("question");
    }

    public override async Task HandleAsync(GetPaginatedQuestionsRequest req, CancellationToken ct)
    {
        var questionsPaginatedData = await _context.QuestionBases
            .Include(questionBase => questionBase.Questions)
            .ThenInclude(question => question.Answers)
            .Where(questionBase => 
                questionBase.Id == Guid.Parse(req.QuestionBaseId) &&
                questionBase.OwnerId == GetUserId()
            )
            .SelectMany(questionBase => questionBase.Questions)
            .ToPaginatedDataAsync(req.PageNumber, req.PageSize, ct);

        if (questionsPaginatedData == null)
        {
            await SendOkAsync(Result<GetPaginatedQuestionsResponse>.Error("Niepoprawne dane bazy pytań"), ct);
            return;
        }

        GetPaginatedQuestionsResponse data = new(questionsPaginatedData.ToIdentifiedQuestionsPaginatedData(ct));

        await SendOkAsync(Result<GetPaginatedQuestionsResponse>.Success(data), ct);
    }
}
