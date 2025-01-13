using QuizHub.Application.Common.Models;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Get;

public record GetPaginatedQuestionsResponse(PaginatedData<IdentifiedQuestion> Data, string QuestionBaseName);
