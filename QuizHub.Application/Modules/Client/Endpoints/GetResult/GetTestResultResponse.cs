using QuizHub.Application.Modules.Client.Models;

namespace QuizHub.Application.Modules.Client.Endpoints.GetResult;

public record GetTestResultResponse(TestResultDto Dto)
    : TestResultDto(Dto.EarnedPoints, Dto.MaxPoints, Dto.TimeInSeconds, Dto.Username);
