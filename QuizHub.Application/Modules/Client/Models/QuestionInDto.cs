using QuizHub.Domain.Enums;

namespace QuizHub.Application.Modules.Client.Models;

public class QuestionInDto
{
    public Guid Id { get; set; }
    public List<Guid> SelectedAnswerIds { get; set; } = [];
}
