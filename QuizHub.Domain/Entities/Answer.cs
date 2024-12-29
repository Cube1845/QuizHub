namespace QuizHub.Domain.Entities;

public class Answer(Guid questionId, string? content, bool isCorrect, Guid? imageId = null)
{
    public Guid Id { get; set; }
    public Guid QuestionId { get; set; } = questionId;
    public Question Question { get; set; } = null!;
    public string? Content { get; set; } = content;
    public bool IsCorrect { get; set; } = isCorrect;
    public Guid? ImageId { get; set; } = imageId;
}
