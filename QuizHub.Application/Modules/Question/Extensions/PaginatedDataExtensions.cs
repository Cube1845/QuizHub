using QuizHub.Application.Common.Models;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Extensions;

public static class PaginatedDataExtensions
{
    public static PaginatedData<IdentifiedQuestion> ToIdentifiedQuestionsPaginatedData(this PaginatedData<Domain.Entities.Question> paginatedData, CancellationToken ct = default)
    {
        var identifiedQuestions = paginatedData.Data.Select(pd =>
        {
            return new IdentifiedQuestion()
            {
                Id = pd.Id,
                Content = pd.Content,
                QuestionType = pd.QuestionType,
                Image = pd.Image != null ? pd.Image.ToBaseImage() : null,
                Answers = pd.Answers.Select(a =>
                {
                    return new IdentifiedAnswer()
                    {
                        Id = a.Id,
                        Content = a.Content,
                        IsCorrect = a.IsCorrect,
                        Image = a.Image != null ? a.Image.ToBaseImage() : null
                    };
                }).ToList()
            };
        }).ToList();

        return new PaginatedData<IdentifiedQuestion>(identifiedQuestions, paginatedData.TotalItems);
    }
}
