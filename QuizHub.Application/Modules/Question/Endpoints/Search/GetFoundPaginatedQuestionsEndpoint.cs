using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Extensions;
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

        var questionBaseQueryable = _context.QuestionBases
            .Include(questionBase => questionBase.Questions)
            .ThenInclude(question => question.Answers)
            .Where(questionBase =>
                questionBase.Id == questionBaseId &&
                questionBase.OwnerId == userId
            );

        if (!await questionBaseQueryable.AnyAsync(ct))
        {
            throw new DomainException("Taka baza pytań nie istnieje");
        }

        var questionsDb = await questionBaseQueryable
            .SelectMany(questionBase => questionBase.Questions)
            .Where(question =>
                question.Content.Contains(key)
            )
            .GetPage(pageNumber, pageSize)
            .ToListAsync(ct);

        var totalItems = await _context.QuestionBases
            .Include(questionBase => questionBase.Questions)
            .Where(questionBase =>
                questionBase.Id == questionBaseId &&
                questionBase.OwnerId == userId
            )
            .SelectMany(questionBase => questionBase.Questions)
            .CountAsync(ct);

        var identifiedQuestions = questionsDb.ToIdentifiedQuestionList();

        return new PaginatedData<IdentifiedQuestion>(identifiedQuestions, totalItems);
    }
}
