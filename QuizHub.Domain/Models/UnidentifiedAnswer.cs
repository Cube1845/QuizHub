using Microsoft.AspNetCore.Http;

namespace QuizHub.Domain.Models;

public class UnidentifiedAnswer : UnidentifiedAnswerWithNoImage
{
    public IFormFile? Image { get; set; }

    public UnidentifiedAnswer(UnidentifiedAnswerWithNoImage answer, IFormFile? contentImage)
    {
        Content = answer.Content;
        IsCorrect = answer.IsCorrect;
        Image = contentImage;
    }
}
