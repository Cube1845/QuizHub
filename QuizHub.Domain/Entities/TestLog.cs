namespace QuizHub.Domain.Entities;

public class TestLog
{
    public Guid Id { get; set; }
    public Guid TestId { get; set; }
    public Test? Test { get; set; }
    public TimeSpan Duration { get; set; }
    public DateTime SolvedDate { get; set; }
    public string Username { get; set; } = string.Empty;
    public ICollection<SelectedAnswer> SelectedAnswers { get; set; } = [];
}
