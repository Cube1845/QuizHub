using QuizHub.Domain.Enums;

namespace QuizHub.Domain.Entities;

public class Question(Guid id, Guid questionBaseId, string content, QuestionType questionType)
{
    public Guid Id { get; set; } = id;
    public Guid QuestionBaseId { get; set; } = questionBaseId;
    public QuestionBase QuestionBase { get; set; } = null!;
    public string Content { get; set; } = content;
    public QuestionType QuestionType { get; set; } = questionType;
    public QuestionImage? Image { get; set; } = null!;
    public ICollection<Answer> Answers { get; set; } = [];
}
