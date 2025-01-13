using Microsoft.AspNetCore.Http;

namespace QuizHub.Application.Modules.Question.Extensions;

public static class IFormFileExtensions
{
    public static async Task<Domain.Entities.Image> ToImageDb(this IFormFile imageFile, CancellationToken ct)
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
