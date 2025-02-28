using QuizHub.Domain.Entities;

namespace QuizHub.Application.Modules.TestLogs.Models;

public record TestLogDto
(
    Guid Id,
    int DurationInSeconds, 
    DateTime SolveDate,
    string Username,
    int EarnedPoints,
    int MaxPoints
)
{
    public static TestLogDto FromTestLogDb(TestLog testLogDb)
    {
        var earnedPoints = testLogDb.SelectedAnswers
            .Where(tl => tl.Scored)
        .Count();

        var maxPoints = testLogDb.SelectedAnswers.Count;

        var totalDurationSeconds = Convert.ToInt32(Math.Floor(testLogDb.Duration.TotalSeconds));

        TestLogDto dto = new
        (
            testLogDb.Id,
            totalDurationSeconds,
            testLogDb.SolvedDate,
            testLogDb.Username,
            earnedPoints,
            maxPoints
        );

        return dto;
    }
}
