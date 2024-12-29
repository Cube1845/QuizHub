using Microsoft.AspNetCore.Http;
using QuizHub.Domain.Entities;

namespace QuizHub.Application.Modules.Question.Extensions;

public static class IFormFileExtensions
{
    public static async Task<Image> ToImageDb(this IFormFile imageFile, CancellationToken ct = default)
    {
        using var memoryStream = new MemoryStream();
        await imageFile.CopyToAsync(memoryStream, ct);

        var baseImage = new Image
        {
            Name = imageFile.FileName,
            Data = memoryStream.ToArray(),
            ContentType = imageFile.ContentType
        };

        return baseImage;
    }
}
