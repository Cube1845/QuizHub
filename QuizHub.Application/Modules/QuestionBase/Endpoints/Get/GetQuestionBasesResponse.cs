using QuizHub.Application.Modules.QuestionBase.Models;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Get;

public class GetQuestionBasesResponse(List<QuestionBaseData> data) : List<QuestionBaseData>(data);