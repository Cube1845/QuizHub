using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.QuestionBase.Models;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Get;

public class GetQuestionBasesEndpoint(IAppDbContext context) : IdentifiedEndpointWithoutRequest<Result<GetQuestionBasesResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("question-base");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var userId = GetUserId();

        var questionBases = await _context.QuestionBases
            .Include(questionBase => questionBase.Questions)
            .Where(questionBase => questionBase.OwnerId == userId)
            .ToListAsync(ct);

        if (questionBases == null || questionBases.Count == 0)
        {
            await SendOkAsync(Result<GetQuestionBasesResponse>.Success(new([])), ct);
            return;
        }

        List<QuestionBaseData> data = ConvertToQuestionBaseDataList(questionBases);

        await SendOkAsync(Result<GetQuestionBasesResponse>.Success(data), ct);
    }

    public List<QuestionBaseData> ConvertToQuestionBaseDataList(List<Domain.Entities.QuestionBase> questionBaseList)
    {
        return questionBaseList.Select(questionBase =>
        {
            return new QuestionBaseData(
                questionBase.Id,
                questionBase.Name,
                questionBase.Questions.Count
            );
        }).ToList();
    }
}
