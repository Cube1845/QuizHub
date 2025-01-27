using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.TestCreator.Endpoints.Delete;

public class DeleteTestValidator : Validator<DeleteTestRequest>
{
    public DeleteTestValidator()
    {
        RuleFor(x => x.TestId)
            .NotEmpty()
            .MustBeCorrectGuid();
    }
}
