using QuizHub.Domain.Enums;

namespace QuizHub.Application.Modules.Client.Models;

public class QuestionOutDto(Domain.Entities.Question questionDb)
{
    public Guid Id { get; set; } = questionDb.Id;
    public string Content { get; set; } = questionDb.Content;
    public QuestionType QuestionType { get; set; } = questionDb.QuestionType;
    public Guid? ImageId { get; set; } = questionDb.ImageId;
    public List<AnswerOutDto> Answers { get; set; } = questionDb.Answers.Select(answerDb => new AnswerOutDto(answerDb)).ToList();
}
