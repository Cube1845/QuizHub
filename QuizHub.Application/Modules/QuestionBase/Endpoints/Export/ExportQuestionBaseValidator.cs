using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Export;

public class ExportQuestionBaseValidator : AbstractValidator<ExportQuestionBaseRequest>
{
    public ExportQuestionBaseValidator()
    {
        RuleFor(x => x.QuestionBaseId)
            .NotEmpty()
            .MustBeCorrectGuid();
    }
}
