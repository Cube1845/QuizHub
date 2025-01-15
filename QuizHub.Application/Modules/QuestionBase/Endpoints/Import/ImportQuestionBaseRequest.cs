using Microsoft.AspNetCore.Http;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Import;

public record ImportQuestionBaseRequest(IFormFile QuestionBaseZip);