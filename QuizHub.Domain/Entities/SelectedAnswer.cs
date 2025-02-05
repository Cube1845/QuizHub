namespace QuizHub.Domain.Entities;

public class SelectedAnswer
{
    public Guid Id { get; set; }
    public Guid TestLogId { get; set; }
    public TestLog? TestLog { get; set; }
    public Guid QuestionId { get; set; }
    public List<Guid> SelectedAnswerIds { get; set; } = [];
    public bool Scored { get; set; }
}
