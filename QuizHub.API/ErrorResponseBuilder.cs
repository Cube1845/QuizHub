using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using QuizHub.Application.Common.Models;

namespace QuizHub.API;

public static class ErrorResponseBuilder
{
    public static Result Build(List<ValidationFailure> failures)
    {
        var message = string.Join(" ", failures.Select(x => x.ErrorMessage));
        return Result.Error(message);
    }
}