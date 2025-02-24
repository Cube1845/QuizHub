namespace QuizHub.Application.Modules.TestLogs.Models;

public record TestLogDto
(
    Guid Id,
    int DurationInSeconds, 
    DateTime SolveDate,
    string Username,
    int EarnedPoints,
    int MaxPoints
);
