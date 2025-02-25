using QuizHub.Domain.Enums;

namespace QuizHub.Application.Modules.TestLogs.Models;

public record UsedQuestion
(
    string Content,
    QuestionType QuestionType,
    Guid? ImageId,
    bool IsScored,
    List<SelectedAnswerDto> Answers
);
