using QuizHub.Domain.Models;

namespace QuizHub.Domain.Entities;

public class QuestionImage : BaseImage
{
    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;
}
