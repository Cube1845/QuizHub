using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace QuizHub.Application.Modules.Question.Extensions;

public static class DbSetExtensions
{
    public static async Task<Domain.Entities.Question?> GetQuestionWithIncludedAnswers(
        this DbSet<Domain.Entities.QuestionBase> questionBases,
        Guid userId,
        Guid questionBaseId,
        Guid questionId,
        CancellationToken ct
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

    public static async Task<Guid?> AddImage(this DbSet<Domain.Entities.Image> images, IFormFile? imageToAdd, CancellationToken ct)
    {
        if (imageToAdd is null)
        {
            return null;
        }

        var image = await imageToAdd.ToImageDb(ct);

        await images.AddAsync(image, ct);
        return image.Id;
    }

    public static async Task RemoveImage(this DbSet<Domain.Entities.Image> images, Guid imageId, CancellationToken ct)
    {
        var image = await images.FindAsync([imageId], ct);

        if (image is not null)
        {
            images.Remove(image);
        }
    }
}
