using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.TestOptions.Endpoints.Update;

public class UpdateTestSettingsValidator : Validator<UpdateTestSettingsRequest>
{
    public UpdateTestSettingsValidator()
    {
        RuleFor(x => x.UsedQuestionBases)
            .NotNull();

        RuleForEach(x => x.UsedQuestionBases)
            .Must(x => x.QuestionBaseId != Guid.Empty);

        RuleFor(x => x)
            .Must(x =>
            {
                var demandedQuestionsCount = x.UsedQuestionBases
                    .Sum(x => x.MinimalQuestionCount);

                if (demandedQuestionsCount > x.QuestionCount)
                {
                    return false;
                }

                return true;
            }).WithMessage("Suma minimalnie wymaganych pytań z baz pytań nie może przekraczać ogólnej liczby pytań");
    }
}
