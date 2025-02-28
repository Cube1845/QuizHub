using QuizHub.Application.Modules.TestLogs.Models;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.GetHistories;

public class GetTestHistoriesResponse(List<TestHistoryData> Data) : List<TestHistoryData>(Data);
