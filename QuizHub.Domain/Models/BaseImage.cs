using Microsoft.AspNetCore.Http;

namespace QuizHub.Domain.Models;

public class BaseImage
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public byte[] Data { get; set; } = [];
    public string ContentType { get; set; } = string.Empty;

    public static async Task<BaseImage> FromIFormFile(IFormFile imageFile, CancellationToken ct = default)
    {
        using var memoryStream = new MemoryStream();
        await imageFile.CopyToAsync(memoryStream, ct);

        var baseImage = new BaseImage
        {
            Name = imageFile.FileName,
            Data = memoryStream.ToArray(),
            ContentType = imageFile.ContentType
        };

        return baseImage;
    }
}
