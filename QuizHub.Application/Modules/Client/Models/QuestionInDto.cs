using QuizHub.Domain.Enums;

namespace QuizHub.Application.Modules.Client.Models;

public class QuestionInDto
{
    public Guid Id { get; set; }
    public QuestionType QuestionType { get; set; }
    public List<AnswerInDto> Answers { get; set; } = [];
}
