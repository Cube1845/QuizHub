namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Update;

public record UpdateQuestionBaseNameRequest(Guid QuestionBaseId, string UpdatedName);
