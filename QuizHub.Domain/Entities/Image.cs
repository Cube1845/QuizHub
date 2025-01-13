using QuizHub.Domain.Models;

namespace QuizHub.Domain.Entities;

public class Image
{
    public Guid Id { get; set; }
    public byte[] Data { get; set; } = [];
    public string ContentType { get; set; } = string.Empty;

    public void Update(byte[] data, string contentType)
    {
        Data = data;
        ContentType = contentType;
    }
}
