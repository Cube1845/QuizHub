using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.Question.Endpoints.Search;

public class GetFoundPaginatedQuestionsValidator : Validator<GetFoundPaginatedQuestionsRequest>
{
    public GetFoundPaginatedQuestionsValidator()
    {
        RuleFor(request => request.QuestionBaseId)
            .NotEmpty()
            .MustBeCorrectGuid();

        RuleFor(request => request.Key)
            .NotEmpty();
    }
}
