using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Extensions;

public static class QuestionListExtensions
{
    public static List<IdentifiedQuestion> ToIdentifiedQuestionList(this List<Domain.Entities.Question> questionsDb)
    {
        if (questionsDb.Count == 0)
        {
            return [];
        }

        List<IdentifiedQuestion> identifiedQuestions = [];

        foreach (var question in questionsDb)
        {
            List<IdentifiedAnswer> answers = [];

            foreach (var answer in question.Answers)
            {
                answers.Add(new IdentifiedAnswer()
                {
                    Id = answer.Id,
                    Content = answer.Content,
                    IsCorrect = answer.IsCorrect,
                    ImageId = answer.ImageId
                });
            }

            var questionToAdd = new IdentifiedQuestion()
            {
                Id = question.Id,
                Content = question.Content,
                QuestionType = question.QuestionType,
                ImageId = question.ImageId,
                Answers = answers
            };

            identifiedQuestions.Add(questionToAdd);
        }

        return identifiedQuestions;
    }
}
