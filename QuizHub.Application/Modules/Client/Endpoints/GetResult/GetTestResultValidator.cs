using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.Client.Endpoints.GetResult;

public class GetTestResultValidator : Validator<GetTestResultRequest>
{
    public GetTestResultValidator()
    {
        RuleFor(x => x.TestLogId)
            .NotEmpty()
            .MustBeCorrectGuid();
    }
}
