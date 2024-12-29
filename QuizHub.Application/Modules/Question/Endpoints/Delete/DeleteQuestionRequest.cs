namespace QuizHub.Application.Modules.Question.Endpoints.Delete;

public class DeleteQuestionRequest(Guid questionBaseId, Guid questionId)
{
    [QueryParam]
    public Guid QuestionBaseId { get; set; } = questionBaseId;
    [QueryParam]
    public Guid QuestionId { get; set; } = questionId;
}
