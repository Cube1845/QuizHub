namespace QuizHub.Domain.Entities;

public class TestSolving(Guid testId, DateTime startedAt, List<Guid> drawnQuestionsIds)
{
    public Guid Id { get; set; }
    public Guid TestId { get; set; } = testId;
    public DateTime StartedAt { get; set; } = startedAt;
    public List<Guid> DrawnQuestionsIds { get; set; } = drawnQuestionsIds;

}
