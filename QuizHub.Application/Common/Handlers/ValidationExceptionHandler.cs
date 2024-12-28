using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Common.Handlers;

internal sealed class ValidationExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken ct)
    {
        httpContext.Response.StatusCode = StatusCodes.Status200OK;
        httpContext.Response.ContentType = "application/json";

        Result result = Result.Error(exception.Message);

        await httpContext.Response
            .WriteAsJsonAsync(result, ct);

        return true;
    }
}
