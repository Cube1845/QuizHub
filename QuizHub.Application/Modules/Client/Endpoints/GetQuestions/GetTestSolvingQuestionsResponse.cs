using QuizHub.Application.Modules.Client.Models;

namespace QuizHub.Application.Modules.Client.Endpoints.GetQuestions;

public record GetTestSolvingQuestionsResponse(List<QuestionOutDto> Questions);
