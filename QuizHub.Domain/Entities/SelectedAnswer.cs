namespace QuizHub.Domain.Entities;

public class SelectedAnswer(Guid testLogId, Guid questionId, List<Guid> selectedAnswerIds, bool scored)
{
    public Guid Id { get; set; }
    public Guid TestLogId { get; set; } = testLogId;
    public TestLog? TestLog { get; set; }
    public Guid QuestionId { get; set; } = questionId;
    public List<Guid> SelectedAnswerIds { get; set; } = selectedAnswerIds;
    public bool Scored { get; set; } = scored;
}
