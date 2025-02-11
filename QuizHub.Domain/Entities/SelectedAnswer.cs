namespace QuizHub.Domain.Entities;

public class SelectedAnswer(Guid testLogId, Guid questionId, List<Guid> selectedAnswerIds, int scoredPoints)
{
    public Guid Id { get; set; }
    public Guid TestLogId { get; set; } = testLogId;
    public TestLog? TestLog { get; set; }
    public Guid QuestionId { get; set; } = questionId;
    public List<Guid> SelectedAnswerIds { get; set; } = selectedAnswerIds;
    public int ScoredPoints { get; set; } = scoredPoints;
}
