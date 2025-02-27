using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.TestLogs.Models;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.GetLogs;

public record GetTestLogsResponse(PaginatedData<TestLogDto> TestLogs, string TestName);