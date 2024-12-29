using Microsoft.EntityFrameworkCore;

namespace QuizHub.Application.Modules.Question.Extensions;

public static class QuestionBaseExtensions
{
    public static async Task<Domain.Entities.Question?> GetQuestionWithIncludedAnswersAsync(
        this DbSet<Domain.Entities.QuestionBase> questionBases,
        Guid userId,
        Guid questionBaseId,
        Guid questionId,
        CancellationToken ct = default
    )
    {
        return await questionBases
            .Where(questionBase =>
                questionBase.Id == questionBaseId &&
                questionBase.OwnerId == userId
            )
            .Include(questionBase => questionBase.Questions)
            .SelectMany(questionBase => questionBase.Questions)
            .Include(question => question.Answers)
            .FirstOrDefaultAsync(question => question.Id == questionId, ct);
    }
}
