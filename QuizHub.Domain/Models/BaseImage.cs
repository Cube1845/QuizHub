namespace QuizHub.Domain.Models;

public class BaseImage
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public byte[] Data { get; set; } = [];
    public string ContentType { get; set; } = string.Empty;
}
