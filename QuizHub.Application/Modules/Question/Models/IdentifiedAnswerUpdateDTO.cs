using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Models;

public class IdentifiedAnswerUpdateDTO : UnidentifiedAnswer
{
    public Guid? Id { get; set; }
    public bool ImageRemoved { get; set; }
}
