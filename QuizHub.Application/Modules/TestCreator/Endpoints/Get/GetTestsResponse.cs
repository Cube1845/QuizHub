using QuizHub.Application.Modules.TestCreator.Models;

namespace QuizHub.Application.Modules.TestCreator.Endpoints.Get;

public class GetTestsResponse(List<TestData> data) : List<TestData>(data);
