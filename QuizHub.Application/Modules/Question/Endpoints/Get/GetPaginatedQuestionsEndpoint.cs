using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Domain.Models;
using System.Text;

namespace QuizHub.Application.Modules.Question.Endpoints.Get;

public class GetPaginatedQuestionsEndpoint(IAppDbContext context) : Endpoint<GetPaginatedQuestionsRequest, Result<GetPaginatedQuestionsResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("question");
    }

    public override async Task HandleAsync(GetPaginatedQuestionsRequest req, CancellationToken ct)
    {
        var paginatedData = 
            await GetIdentifiedQuestionsPaginatedDataAsync(req.QuestionBaseId, req.PageNumber, req.PageSize, ct);

        if (paginatedData == null)
        {
            await SendOkAsync(Result<GetPaginatedQuestionsResponse>.Error("Błąd danych"), ct);
            return;
        }

        var questionBaseName = await GetQuestionBaseName(req.QuestionBaseId, ct);

        GetPaginatedQuestionsResponse data = new(paginatedData, questionBaseName);

        await SendOkAsync(Result<GetPaginatedQuestionsResponse>.Success(data), ct);
    }

    private async Task<string> GetQuestionBaseName(Guid questionBaseId, CancellationToken ct)
    {
        var userId = User.GetId();

        var questionBaseDb = await _context.QuestionBases
            .FirstOrDefaultAsync(questionBase =>
                questionBase.Id == questionBaseId &&
                questionBase.OwnerId == userId
            , ct) 
            ?? throw new DomainException("Taka baza pytań nie istnieje");

        return questionBaseDb.Name;
    }

    private async Task<PaginatedData<IdentifiedQuestion>> GetIdentifiedQuestionsPaginatedDataAsync(Guid questionBaseId, int pageNumber, int pageSize, CancellationToken ct)
    {
        var userId = User.GetId();

        var questionsDb = await _context.QuestionBases
            .Include(questionBase => questionBase.Questions)
            .ThenInclude(question => question.Answers)
            .Where(questionBase =>
                questionBase.Id == questionBaseId &&
                questionBase.OwnerId == userId
            )
            .SelectMany(questionBase => questionBase.Questions)
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
