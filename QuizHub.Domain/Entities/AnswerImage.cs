using QuizHub.Domain.Models;

namespace QuizHub.Domain.Entities;

public class AnswerImage : BaseImage
{
    public Guid AnswerId { get; set; }
    public Answer Answer { get; set; } = null!;

    public static AnswerImage ConstructFromBaseImage(BaseImage baseImage, Guid answerId)
    {
        return new AnswerImage()
        {
            Id = baseImage.Id,
            Name = baseImage.Name,
            Data = baseImage.Data,
            ContentType = baseImage.ContentType,
            AnswerId = answerId
        };
    }

    public BaseImage ToBaseImage()
    {
        return new BaseImage()
        {
            Id = Id,
            Name = Name,
            Data = Data,
            ContentType = ContentType
        };
    }
}
