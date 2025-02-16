namespace QuizHub.Domain.Entities;

public class TestSolving(Guid testId, List<Guid> drawnQuestionsIds, string username)
{
    public Guid Id { get; set; }
    public string Username { get; set; } = username;
    public Guid TestId { get; set; } = testId;
    public DateTime? StartedAt { get; set; }
    public List<Guid> DrawnQuestionsIds { get; set; } = drawnQuestionsIds;
    public bool QuestionsDownloaded { get; set; }
}
