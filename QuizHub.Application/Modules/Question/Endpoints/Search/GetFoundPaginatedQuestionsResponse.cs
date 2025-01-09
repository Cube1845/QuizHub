using QuizHub.Application.Common.Models;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Search;

public class GetFoundPaginatedQuestionsResponse(PaginatedData<IdentifiedQuestion> data)
    : PaginatedData<IdentifiedQuestion>(data.Data, data.TotalItems);
