namespace QuizHub.Application.Modules.TestCreator.Endpoints.Update;

public record UpdateTestNameRequest(Guid TestId, string UpdatedName);
