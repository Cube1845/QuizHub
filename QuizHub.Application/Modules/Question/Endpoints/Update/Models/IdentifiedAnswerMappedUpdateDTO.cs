using Microsoft.AspNetCore.Http;

namespace QuizHub.Application.Modules.Question.Endpoints.Update.Models;

public class IdentifiedAnswerMappedUpdateDTO : IdentifiedAnswerUpdateDTO
{
    public IFormFile? Image { get; set; }

    public IdentifiedAnswerMappedUpdateDTO(IdentifiedAnswerUpdateDTO answer, IFormFile? contentImage)
    {
        Id = answer.Id;
        Content = answer.Content;
        IsCorrect = answer.IsCorrect;
        Image = contentImage;
        ImageEditionState = answer.ImageEditionState;
    }
}
