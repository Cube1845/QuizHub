using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Endpoints.Get;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Search;

public class GetFoundPaginatedQuestionsEndpoint(IAppDbContext context) : Endpoint<GetFoundPaginatedQuestionsRequest, Result<GetFoundPaginatedQuestionsResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("question/search");
    }

    public override async Task HandleAsync(GetFoundPaginatedQuestionsRequest req, CancellationToken ct)
    {
        var paginatedData =
            await SearchForQuestionsAndGetPaginatedDataAsync(req.QuestionBaseId, req.PageNumber, req.PageSize, req.Key, ct);

        if (paginatedData == null)
        {
            await SendOkAsync(Result<GetFoundPaginatedQuestionsResponse>.Error("Błąd danych"), ct);
            return;
        }

        GetFoundPaginatedQuestionsResponse data = new(paginatedData);

        await SendOkAsync(Result<GetFoundPaginatedQuestionsResponse>.Success(data), ct);
    }

    private async Task<PaginatedData<IdentifiedQuestion>> SearchForQuestionsAndGetPaginatedDataAsync(Guid questionBaseId, int pageNumber, int pageSize, string key, CancellationToken ct = default)
    {
        var userId = this.GetUserId();

        var questionsQueryable = _context.QuestionBases
            .Include(questionBase => questionBase.Questions)
            .ThenInclude(question => question.Answers)
            .Where(questionBase =>
                questionBase.Id == questionBaseId &&
                questionBase.OwnerId == userId
            )
            .SelectMany(questionBase => questionBase.Questions)
            .Where(question =>
                question.Content.Contains(key)
            );

        var questionsDb = await questionsQueryable
            .GetPage(pageNumber, pageSize)
            .ToListAsync(ct);

        var totalItems = await questionsQueryable.CountAsync(ct);

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

        return new PaginatedData<IdentifiedQuestion>(identifiedQuestions, totalItems);
    }
}
