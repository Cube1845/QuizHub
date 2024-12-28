using QuizHub.Domain.Models;

namespace QuizHub.Domain.Entities;

public class Answer
{
    public Guid Id { get; set; }
    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;
    public string? Content { get; set; }
    public bool IsCorrect { get; set; }
    public AnswerImage Image { get; set; } = null!;
}
