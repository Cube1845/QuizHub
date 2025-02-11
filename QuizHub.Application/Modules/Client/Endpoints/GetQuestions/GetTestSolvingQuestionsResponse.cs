using QuizHub.Application.Modules.Client.Models;

namespace QuizHub.Application.Modules.Client.Endpoints.GetQuestions;

public class GetTestSolvingQuestionsResponse(List<QuestionOutDto> Questions) : List<QuestionOutDto>(Questions);
