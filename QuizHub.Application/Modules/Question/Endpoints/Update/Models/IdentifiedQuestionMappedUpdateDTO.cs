using Microsoft.AspNetCore.Http;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Update.Models;

public class IdentifiedQuestionMappedUpdateDto : IdentifiedQuestionUpdateDto
{
    public IFormFile? Image { get; set; }
    public new List<IdentifiedAnswerMappedUpdateDto> Answers { get; set; } = [];

    public IdentifiedQuestionMappedUpdateDto(IdentifiedQuestionUpdateDto question, IFormFile? contentImage, List<IFormFile?> answerImages)
    {
        Id = question.Id;
        Content = question.Content;
        QuestionType = question.QuestionType;
        ImageEditionState = question.ImageEditionState;
        Answers = question.Answers.Select((answerWithNoimage, i) =>
            new IdentifiedAnswerMappedUpdateDto(answerWithNoimage, answerImages[i]))
        .ToList();
        Image = contentImage;
    }
}
