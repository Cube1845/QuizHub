namespace QuizHub.Application.Modules.TestLogs.Endpoints.Logs.Delete;

public class DeleteTestLogRequest()
{
    [QueryParam]
    public Guid TestId { get; set; }
    [QueryParam]
    public Guid TestLogId { get; set; }
}
