using QuizHub.Domain.Enums;

namespace QuizHub.Domain.Models;

public class UnidentifiedQuestionWithNoImage
{
    public string Content { get; set; } = string.Empty;
    public QuestionType QuestionType { get; set; }
    public List<UnidentifiedAnswerWithNoImage> Answers { get; set; } = [];
}
