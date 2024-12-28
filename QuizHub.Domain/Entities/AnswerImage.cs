using QuizHub.Domain.Models;

namespace QuizHub.Domain.Entities;

public class AnswerImage : BaseImage
{
    public Guid AnswerId { get; set; }
    public Answer Answer { get; set; } = null!;
}
