using Microsoft.AspNetCore.Http;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Extensions;

public static class QuestionImageDbExtensions
{
    public static async Task<QuestionImage?> ToQuestionImageDbAsync(this IFormFile? imageFile, Guid questionId, CancellationToken ct = default)
    {
        return imageFile != null ?
            QuestionImage
                .ConstructFromBaseImage(await BaseImage.FromIFormFile(imageFile, ct), questionId) :
            null;
    }

    public static async Task<AnswerImage?> ToAnswerImageDbAsync(this IFormFile? imageFile, Guid answerId, CancellationToken ct = default)
    {
        return imageFile != null ?
            AnswerImage
                .ConstructFromBaseImage(await BaseImage.FromIFormFile(imageFile, ct), answerId) :
            null;
    }
}
