using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Get;

public class GetPaginatedQuestionsEndpoint(IAppDbContext context) : Endpoint<GetPaginatedQuestionsRequest, Result<GetPaginatedQuestionsResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("question");
    }

    public override async Task HandleAsync(GetPaginatedQuestionsRequest req, CancellationToken ct)
    {
        var (Data, QuestionBaseName) = 
            await GetIdentifiedQuestionsPaginatedDataAsync(req.QuestionBaseId, req.PageNumber, req.PageSize, ct);

        var questionsPaginatedData = Data;

        if (questionsPaginatedData == null)
        {
            await SendOkAsync(Result<GetPaginatedQuestionsResponse>.Error("Błąd danych"), ct);
            return;
        }

        GetPaginatedQuestionsResponse data = new(questionsPaginatedData, QuestionBaseName);

        await SendOkAsync(Result<GetPaginatedQuestionsResponse>.Success(data), ct);
    }

    private async Task<(PaginatedData<IdentifiedQuestion> Data, string QuestionBaseName)> GetIdentifiedQuestionsPaginatedDataAsync(Guid questionBaseId, int pageNumber, int pageSize, CancellationToken ct = default)
    {
        var userId = this.GetUserId();

        var questionBaseQueryable = _context.QuestionBases
            .Include(questionBase => questionBase.Questions)
            .ThenInclude(question => question.Answers)
            .Where(questionBase =>
                questionBase.Id == questionBaseId &&
                questionBase.OwnerId == userId
            );

        var questionBaseDb = await questionBaseQueryable
            .FirstOrDefaultAsync(ct) ?? throw new Exception("Taka baza pytań nie istnieje");

        var questionsQueryable = questionBaseQueryable
            .SelectMany(questionBase => questionBase.Questions);

        var questionsDb = questionsQueryable
            .GetPage(pageNumber, pageSize)
            .ToList();

        var totalItems = await questionsQueryable
            .CountAsync(ct);

        var identifiedQuestions = questionsDb.ToIdentifiedQuestionList();

        return (new PaginatedData<IdentifiedQuestion>(identifiedQuestions, totalItems), questionBaseDb.Name);
    }
}
