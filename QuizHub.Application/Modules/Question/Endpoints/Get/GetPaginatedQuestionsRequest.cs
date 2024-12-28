namespace QuizHub.Application.Modules.Question.Endpoints.Get;

public class GetPaginatedQuestionsRequest(string questionBaseId, int pageNumber, int pageSize)
{
    [QueryParam]
    public string QuestionBaseId { get; set; } = questionBaseId;
    [QueryParam]
    public int PageNumber { get; set; } = pageNumber;
    [QueryParam]
    public int PageSize { get; set; } = pageSize;
}