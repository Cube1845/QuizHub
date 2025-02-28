using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.Logs.Delete;

public class DeleteTestLogValidator : Validator<DeleteTestLogRequest>
{
    public DeleteTestLogValidator()
    {
        RuleFor(x => x.TestId)
            .NotEmpty()
            .MustBeCorrectGuid();

        RuleFor(x => x.TestLogId)
            .NotEmpty()
            .MustBeCorrectGuid();
    }
}
