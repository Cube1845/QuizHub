using QuizHub.Domain.Models;

namespace QuizHub.Domain.Entities;

public class QuestionImage : BaseImage
{
    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;

    public static QuestionImage ConstructFromBaseImage(BaseImage baseImage, Guid questionId)
    {
        return new QuestionImage()
        {
            Id = baseImage.Id,
            Name = baseImage.Name,
            Data = baseImage.Data,
            ContentType = baseImage.ContentType,
            QuestionId = questionId
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
