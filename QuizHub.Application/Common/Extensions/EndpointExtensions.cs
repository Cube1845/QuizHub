using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace QuizHub.Application.Common.Extensions;

public static class EndpointExtensions
{
    public static Guid GetUserId<TRequest, TResponse>(this Endpoint<TRequest, TResponse> endpoint) 
        where TRequest : class
    {
        return Guid.Parse(endpoint.User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
    }

    public static Guid GetUserId<TResponse>(this EndpointWithoutRequest<TResponse> endpoint)
    {
        return Guid.Parse(endpoint.User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
    }
}
