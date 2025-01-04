using Microsoft.AspNetCore.Http;

namespace QuizHub.Domain.Models;

public class UnidentifiedQuestion : UnidentifiedQuestionWithNoImage
{
    public IFormFile? Image { get; set; }
    public new List<UnidentifiedAnswer> Answers { get; set; } = [];

    public UnidentifiedQuestion() { }

    public UnidentifiedQuestion(UnidentifiedQuestionWithNoImage question, IFormFile? contentImage, List<IFormFile?> answerImages)
    {
        answerImages = MakeAnswerImageListTheSameLengthAsAnswers(answerImages, question.Answers.Count);

        Content = question.Content;
        QuestionType = question.QuestionType;
        Answers = question.Answers.Select((answerWithNoimage, i) =>
            new UnidentifiedAnswer(answerWithNoimage, answerImages[i]))
        .ToList();
        Image = contentImage;
    }

    private List<IFormFile?> MakeAnswerImageListTheSameLengthAsAnswers(List<IFormFile?> answerImages, int answersLength)
    {
        var answerImagesList = new List<IFormFile?>(answersLength);

        if (answerImages != null)
        {
            answerImagesList.AddRange(answerImages);
        }

        while (answerImagesList.Count < answersLength)
        {
            answerImagesList.Add(null);
        }

        return answerImagesList;
    }
}
