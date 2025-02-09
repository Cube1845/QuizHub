using QuizHub.Application.Modules.Client.Models;

namespace QuizHub.Application.Modules.Client.Endpoints.GetResult;

public record GetTestResultResponse(int EarnedPoints, int MaxPoints, int TimeInSeconds, string Username)
    : TestResultDto(EarnedPoints, MaxPoints, TimeInSeconds, Username);
