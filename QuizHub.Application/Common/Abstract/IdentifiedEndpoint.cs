using System.Security.Claims;

namespace QuizHub.Application.Common.Abstract;

public abstract class IdentifiedEndpoint<TRequest, TResponse> : Endpoint<TRequest, TResponse> where TRequest : notnull
{
    protected Guid GetUserId()
    {
        var nameIdentifier = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;

        if (!Guid.TryParse(nameIdentifier, out Guid userId))
        {
            throw new Exception("Błąd autoryzacji");
        }

        return userId;
    }
}
