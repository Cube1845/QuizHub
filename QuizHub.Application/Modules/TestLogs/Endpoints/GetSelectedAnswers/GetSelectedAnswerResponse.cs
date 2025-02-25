using QuizHub.Application.Modules.TestLogs.Models;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.GetSelectedAnswers;

public record GetSelectedAnswerResponse
(
    Guid TestId,
    DateTime SolveDate,
    int DurationInSeconds,
    string Username,
    int EarnedPoints,
    int MaxPoints,
    List<UsedQuestion?> UsedQuestions
);
