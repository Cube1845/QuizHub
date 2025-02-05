using QuizHub.Domain.Entities;

namespace QuizHub.Application.Modules.Client.Models;

public class AnswerDto(Answer answerDb)
{
    public Guid Id { get; set; } = answerDb.Id;
    public string? Content { get; set; } = answerDb.Content;
    public Guid? ImageId { get; set; } = answerDb.ImageId;
}
