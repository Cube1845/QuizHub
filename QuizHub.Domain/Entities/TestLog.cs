namespace QuizHub.Domain.Entities;

public class TestLog
{
    public Guid Id { get; set; }
    public Guid TestId { get; set; }
    public TimeSpan Duration { get; set; }
    public List<Guid> UsedQuestionIds { get; set; } = [];
    public ICollection<SelectedAnswer> SelectedAnswers { get; set; } = [];
}
