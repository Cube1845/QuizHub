using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.Question.Endpoints.Get;

public class GetPaginatedQuestionsValidator : Validator<GetPaginatedQuestionsRequest>
{
    public GetPaginatedQuestionsValidator()
    {
        RuleFor(x => x.QuestionBaseId)
            .NotEmpty()
            .MustBeCorrectGuid();

        RuleFor(x => x.PageNumber)
            .NotNull()
            .GreaterThan(0);

        RuleFor(x => x.PageSize)
            .NotNull()
            .GreaterThan(0);
    }
}
