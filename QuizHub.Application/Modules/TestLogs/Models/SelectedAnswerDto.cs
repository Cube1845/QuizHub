namespace QuizHub.Application.Modules.TestLogs.Models;

public record SelectedAnswerDto
(
    string? Content,
    Guid? ImageId,
    bool IsSelected,
    bool IsCorrect
);
