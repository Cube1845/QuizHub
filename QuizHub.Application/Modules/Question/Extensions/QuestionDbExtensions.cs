using Microsoft.AspNetCore.Http;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Extensions;

public static class QuestionDbExtensions
{
    public static List<Answer> ToAnswersDb(this List<UnidentifiedAnswer> undefinedAnswers, CancellationToken ct = default)
    {
        List<Answer> answers = [];

        foreach (var undefinedAnswer in undefinedAnswers)
        {
            answers.Add(new Answer
            (
                Guid.Empty,
                undefinedAnswer.Content,
                undefinedAnswer.IsCorrect
            ));
        }

        return answers;
    }


    public static Domain.Entities.Question ToQuestionDb(this UnidentifiedQuestion undefinedQuestion, Guid questionBaseId, CancellationToken ct = default)
    {
        Domain.Entities.Question question = new(
            Guid.Empty,
            questionBaseId,
            undefinedQuestion.Content,
            undefinedQuestion.QuestionType
        );

        return question;
    }
}
