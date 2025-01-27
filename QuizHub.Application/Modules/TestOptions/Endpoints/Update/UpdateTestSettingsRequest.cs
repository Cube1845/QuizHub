using QuizHub.Application.Modules.TestOptions.Models;

namespace QuizHub.Application.Modules.TestOptions.Endpoints.Update;

public record UpdateTestSettingsRequest(Guid TestId, int QuestionCount, List<QuestionBaseWithQuestionCountDto> UsedQuestionBases);
