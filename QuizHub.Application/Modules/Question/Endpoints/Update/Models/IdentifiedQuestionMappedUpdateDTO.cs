using Microsoft.AspNetCore.Http;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Update.Models;

public class IdentifiedQuestionMappedUpdateDTO : IdentifiedQuestionUpdateDTO
{
    public IFormFile? Image { get; set; }
    public new List<IdentifiedAnswerMappedUpdateDTO> Answers { get; set; } = [];

    public IdentifiedQuestionMappedUpdateDTO(IdentifiedQuestionUpdateDTO question, IFormFile? contentImage, List<IFormFile?> answerImages)
    {
        Id = question.Id;
        Content = question.Content;
        QuestionType = question.QuestionType;
        ImageEditionState = question.ImageEditionState;
        Answers = question.Answers.Select((answerWithNoimage, i) =>
            new IdentifiedAnswerMappedUpdateDTO(answerWithNoimage, answerImages[i]))
        .ToList();
        Image = contentImage;
    }
}
