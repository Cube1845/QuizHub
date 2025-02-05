using QuizHub.Application.Modules.Client.Models;

namespace QuizHub.Application.Modules.Client.Endpoints.Finish;

public record FinishTestRequest(List<QuestionInDto> UserQuestions, Guid TestSolvingId);
