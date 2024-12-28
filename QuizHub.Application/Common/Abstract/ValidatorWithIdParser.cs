namespace QuizHub.Application.Common.Abstract;

public abstract class ValidatorWithIdParser<TRequest> : Validator<TRequest> where TRequest : notnull
{
    protected readonly string IncorrectIdMessage = "Niepoprawne id";

    protected bool IsGuidFormat(string id)
    {
        if (!Guid.TryParse(id, out Guid result))
        {
            return false;
        }

        return true;
    }
}
