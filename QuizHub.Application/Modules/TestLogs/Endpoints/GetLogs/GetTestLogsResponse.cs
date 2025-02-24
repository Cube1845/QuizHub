using QuizHub.Application.Modules.TestLogs.Models;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.GetLogs;

public record GetTestLogsResponse(List<TestLogDto> TestLogs, string TestName);