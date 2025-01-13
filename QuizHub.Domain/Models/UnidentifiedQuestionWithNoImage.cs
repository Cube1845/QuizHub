using QuizHub.Domain.Enums;

namespace QuizHub.Domain.Models;

public class UnidentifiedQuestionWithNoImage<T>
    where T : UnidentifiedAnswerWithNoImage
{
    public string Content { get; set; } = string.Empty;
    public QuestionType QuestionType { get; set; }
    public List<T> Answers { get; set; } = [];
}

public class UnidentifiedQuestionWithNoImage : UnidentifiedQuestionWithNoImage<UnidentifiedAnswerWithNoImage>;
