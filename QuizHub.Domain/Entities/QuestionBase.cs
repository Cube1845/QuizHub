namespace QuizHub.Domain.Entities;

public class QuestionBase
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<Question> Questions { get; set; } = [];
}
