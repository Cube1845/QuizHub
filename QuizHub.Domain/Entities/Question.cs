using QuizHub.Domain.Enums;

namespace QuizHub.Domain.Entities;

public class Question(Guid id, Guid questionBaseId, string content, QuestionType questionType, Guid? imageId = null)
{
    public Guid Id { get; set; } = id;
    public Guid QuestionBaseId { get; set; } = questionBaseId;
    public QuestionBase QuestionBase { get; set; } = null!;
    public string Content { get; set; } = content;
    public QuestionType QuestionType { get; set; } = questionType;
    public Guid? ImageId { get; set; } = imageId;
    public ICollection<Answer> Answers { get; set; } = [];

    public void Update(string content, QuestionType questionType, Guid? imageId)
    {
        Content = content;
        QuestionType = questionType;
        ImageId = imageId;
    }
}
