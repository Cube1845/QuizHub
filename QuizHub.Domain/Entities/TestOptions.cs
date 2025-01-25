namespace QuizHub.Domain.Entities;

public class TestOptions
{
    public Guid Id { get; set; }
    public int QuestionCount { get; set; }
    public Guid TestId { get; set; }
    public Test? Test { get; set; }
    public ICollection<QuestionBaseWithQuestionCount> UsedQuestionBasesWithQuestionCounts { get; set; } = [];
}