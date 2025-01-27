using QuizHub.Application.Modules.QuestionBase.Models;
using QuizHub.Application.Modules.TestOptions.Models;

namespace QuizHub.Application.Modules.TestOptions.Endpoints.Get;

public record GetTestOptionsResponse(TestOptionsDto TestOptions, string Code, string Name, bool IsActive, List<QuestionBaseData> UserQuestionBases);