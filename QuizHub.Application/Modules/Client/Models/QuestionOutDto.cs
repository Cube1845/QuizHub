using QuizHub.Domain.Enums;

namespace QuizHub.Application.Modules.Client.Models;

public class QuestionOutDto
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public QuestionType QuestionType { get; set; }
    public Guid? ImageId { get; set; }
    public List<AnswerOutDto> Answers { get; set; }

    public QuestionOutDto(Domain.Entities.Question questionDb)
    {
        Id = questionDb.Id;
        Content = questionDb.Content;
        QuestionType = questionDb.QuestionType;
        ImageId = questionDb.ImageId;

        var answers = questionDb.Answers.Select(answerDb => new AnswerOutDto(answerDb)).ToArray();
        Random.Shared.Shuffle(answers);

        Answers = answers.ToList();
    }
}
