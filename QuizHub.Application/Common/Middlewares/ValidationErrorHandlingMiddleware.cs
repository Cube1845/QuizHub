using FastEndpoints;
using Microsoft.AspNetCore.Http;
using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Common.Middlewares;

public class ValidationErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ValidationErrorHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationFailureException ex)
        {
            List<string> errors = ex.Failures!.Select(f => f.ErrorMessage).ToList();

            var result = Result.Error(string.Join(", ", errors));

            context.Response.StatusCode = StatusCodes.Status200OK;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(result);
        }
        catch (Exception ex)
        {
            var result = Result.Error(ex.Message);

            context.Response.StatusCode = StatusCodes.Status200OK;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(result);
        }
    }
}
