using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Models;

public class IdentifiedQuestionUpdateDTO : UnidentifiedQuestion
{
    public Guid Id { get; set; }
    public bool ImageRemoved { get; set; }
    public new List<IdentifiedAnswerUpdateDTO> Answers { get; set; } = [];
}