namespace QuizHub.Application.Common.Extensions;

public static class ValidationRuleExtensions
{
    public static IRuleBuilderOptions<T, Guid> MustBeCorrectGuid<T>(this IRuleBuilder<T, Guid> ruleBuilder)
    {
        return ruleBuilder.Must(guid => guid != Guid.Empty).WithMessage("Niepoprawne id");
    }

    public static IRuleBuilderOptions<T, IEnumerable<Guid?>> MustBeCorrectGuidsOrNulls<T>(this IRuleBuilder<T, IEnumerable<Guid?>> ruleBuilder)
    {
        return ruleBuilder.Must(guidList => 
            guidList.All(g => 
                g == null ||
                (g != null && g != Guid.Empty)
            )
        ).WithMessage("Niepoprawne id");
    }
}
