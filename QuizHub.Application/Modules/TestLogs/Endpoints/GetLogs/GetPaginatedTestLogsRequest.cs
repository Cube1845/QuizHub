namespace QuizHub.Application.Modules.TestLogs.Endpoints.GetLogs;

public class GetPaginatedTestLogsRequest
{
    [QueryParam]
    public Guid TestId { get; set; }
    [QueryParam]
    public int PageNumber { get; set; }
    [QueryParam]
    public int PageSize { get; set; }
}