using QuizHub.Application.Common.Abstract;

namespace QuizHub.Application.Modules.Question.Endpoints.Get;

public class GetPaginatedQuestionsValidator : ValidatorWithIdParser<GetPaginatedQuestionsRequest>
{
    public GetPaginatedQuestionsValidator()
    {
        RuleFor(x => x.QuestionBaseId)
            .NotNull()
            .NotEmpty()
            .Must(IsGuidFormat).WithMessage(IncorrectIdMessage);

        RuleFor(x => x.PageNumber)
            .NotNull()
            .GreaterThan(0);

        RuleFor(x => x.PageSize)
            .NotNull()
            .GreaterThan(0);
    }
}
