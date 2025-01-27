namespace QuizHub.Domain.Entities;

public class QuestionBaseWithQuestionCount
{
    public Guid TestOptionsId { get; set; }
    public TestOptions? TestOptions { get; set; }
    public Guid QuestionBaseId { get; set; }
    public int? MinimalQuestionCount { get; set; }
}