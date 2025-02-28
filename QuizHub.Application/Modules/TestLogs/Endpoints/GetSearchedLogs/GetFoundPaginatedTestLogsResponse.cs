using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.TestLogs.Models;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.GetSearchedLogs;

public class GetFoundPaginatedTestLogsResponse(PaginatedData<TestLogDto> data)
    : PaginatedData<TestLogDto>(data.Data, data.TotalItems);
