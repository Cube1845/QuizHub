using QuizHub.Domain.Enums;
using QuizHub.Domain.Models;
using System.Collections.ObjectModel;

namespace QuizHub.Domain.Entities;

public class Question
{
    public Guid Id { get; set; }
    public Guid QuestionBaseId { get; set; }
    public QuestionBase QuestionBase { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public QuestionType QuestionType { get; set; }
    public QuestionImage ContentImage { get; set; } = null!;
    public ICollection<Answer> Answers { get; set; } = [];
}
