using QuizHub.Domain.Enums;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Update.Models;

public class IdentifiedQuestionUpdateDTO : UnidentifiedQuestionWithNoImage
{
    public Guid Id { get; set; }
    public ImageEditionState ImageEditionState { get; set; }
    public new List<IdentifiedAnswerUpdateDTO> Answers { get; set; } = [];
}