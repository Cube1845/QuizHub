namespace QuizHub.Application.Modules.Question.Endpoints.Get;

public class GetPaginatedQuestionsRequest(Guid questionBaseId, int pageNumber, int pageSize)
{
    [QueryParam]
    public Guid QuestionBaseId { get; set; } = questionBaseId;
    [QueryParam]
    public int PageNumber { get; set; } = pageNumber;
    [QueryParam]
    public int PageSize { get; set; } = pageSize;
}