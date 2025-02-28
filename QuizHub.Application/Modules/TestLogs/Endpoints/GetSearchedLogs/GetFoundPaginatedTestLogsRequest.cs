namespace QuizHub.Application.Modules.TestLogs.Endpoints.GetSearchedLogs;

public class GetFoundPaginatedTestLogsRequest
{
    [QueryParam]
    public Guid TestId { get; set; }
    [QueryParam]
    public string Key { get; set; } = string.Empty;
    [QueryParam]
    public int PageNumber { get; set; }
    [QueryParam]
    public int PageSize { get; set; }
}
