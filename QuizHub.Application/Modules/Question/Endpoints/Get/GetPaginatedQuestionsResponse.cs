using QuizHub.Application.Common.Models;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Get;

public class GetPaginatedQuestionsResponse(PaginatedData<IdentifiedQuestion> data)
    : PaginatedData<IdentifiedQuestion>(data.Data, data.TotalItems);
