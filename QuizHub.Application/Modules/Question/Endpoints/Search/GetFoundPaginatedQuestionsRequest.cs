namespace QuizHub.Application.Modules.Question.Endpoints.Search;

public class GetFoundPaginatedQuestionsRequest(Guid questionBaseId, string key, int pageNumber, int pageSize)
{
    [QueryParam]
    public Guid QuestionBaseId { get; set; } = questionBaseId;
    [QueryParam]
    public string Key { get; set; } = key;
    [QueryParam]
    public int PageNumber { get; set; } = pageNumber;
    [QueryParam]
    public int PageSize { get; set; } = pageSize;
}
