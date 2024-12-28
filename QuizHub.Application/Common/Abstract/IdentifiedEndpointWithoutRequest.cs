using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace QuizHub.Application.Common.Abstract;

public abstract class IdentifiedEndpointWithoutRequest<TResponse> : EndpointWithoutRequest<TResponse>
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
