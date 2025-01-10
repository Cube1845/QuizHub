using Microsoft.AspNetCore.Http;
using QuizHub.Domain.Entities;

namespace QuizHub.Application.Modules.Question.Extensions;

public static class IFormFileExtensions
{
    public static async Task<Domain.Entities.Image> ToImageDbAsync(this IFormFile imageFile, CancellationToken ct = default)
    {
        using MemoryStream memoryStream = new();
        await imageFile.CopyToAsync(memoryStream, ct);

        var baseImage = new Domain.Entities.Image
        {
            Data = memoryStream.ToArray(),
            ContentType = imageFile.ContentType
        };

        return baseImage;
    }
}
