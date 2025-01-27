using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.TestOptions.Endpoints.Get;

public class GetTestOptionsValidator : Validator<GetTestOptionsRequest>
{
    public GetTestOptionsValidator()
    {
        RuleFor(x => x.TestId)
            .NotEmpty()
            .MustBeCorrectGuid();
    }
}
