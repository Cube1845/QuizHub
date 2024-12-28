using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.QuestionBase.Models;

namespace QuizHub.Application.Modules.QuestionBase.Get;

public class GetQuestionBasesEndpoint(IAppDbContext context) : IdentifiedEndpointWithoutRequest<Result<GetQuestionBasesResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("/question/bases");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var userId = GetUserId();

        var questionBases = await _context.QuestionBases
            .Include(questionBase => questionBase.Questions)
            .Where(questionBase => questionBase.OwnerId == userId)
            .ToListAsync();

        if (questionBases == null || questionBases.Count == 0)
        {
            await SendOkAsync(Result<GetQuestionBasesResponse>.Success(new([])));
        }

        List<QuestionBaseData> data = questionBases!.Select(questionBase =>
        {
            return new QuestionBaseData(
                questionBase.Id.ToString(),
                questionBase.Name,
                questionBase.Questions.Count
            );
        }).ToList();

        await SendOkAsync(Result<GetQuestionBasesResponse>.Success(data));
    }
}
