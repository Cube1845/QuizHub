using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.QuestionBase.Models;
using QuizHub.Application.Modules.TestOptions.Models;
using QuizHub.Domain.Entities;

namespace QuizHub.Application.Modules.TestOptions.Endpoints.Get;

public class GetTestOptionsEndpoint(IAppDbContext context) : Endpoint<GetTestOptionsRequest, Result<GetTestOptionsResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("test-options/{TestId}");
    }

    public override async Task HandleAsync(GetTestOptionsRequest req, CancellationToken ct)
    {
        var testDb = await GetTestDb(req.TestId, ct);

        if (testDb == null || testDb.Options == null)
        {
            await SendOkAsync(Result<GetTestOptionsResponse>.Error("Taki test nie istnieje"), ct);
            return;
        }

        var userQuestionBaseDatas = await GetUserQuestionBaseDatas(ct);

        var data = await BuildResponse(testDb, userQuestionBaseDatas, ct);

        await SendOkAsync(Result<GetTestOptionsResponse>.Success(data), ct);
    }

    private async Task<GetTestOptionsResponse> BuildResponse(Test testDb, List<QuestionBaseData> userQuestionBaseDatas, CancellationToken ct)
    {
        var questionBaseWithDataArray = await Task.WhenAll(testDb.Options!
            .UsedQuestionBasesWithQuestionCounts
            .Select(async qb =>
            {
                var questionBaseName = await GetQuestionBaseNameOrRemove(qb.QuestionBaseId, userQuestionBaseDatas, ct);

                if (questionBaseName == null)
                {
                    return null;
                }

                return new QuestionBaseWithNameAndQuestionCountDto()
                {
                    MinimalQuestionCount = qb.MinimalQuestionCount,
                    QuestionBaseId = qb.QuestionBaseId,
                    QuestionBaseName = questionBaseName,
                };
            }));

        List<QuestionBaseWithNameAndQuestionCountDto>? questionBasesWithData = questionBaseWithDataArray
            .Where(questionBase => questionBase != null)
            .ToList()!;

        TestOptionsDto testOptions = new()
        {
            QuestionCount = testDb.Options.QuestionCount,
            UsedQuestionBases = questionBasesWithData ?? []
        };

        return new(testOptions, testDb.Code, testDb.Name, testDb.IsActive, userQuestionBaseDatas);
    }

    private async Task<string?> GetQuestionBaseNameOrRemove(Guid questionBaseId, List<QuestionBaseData> userQuestionBases, CancellationToken ct)
    {
        var wantedQuestionBase = userQuestionBases
            .FirstOrDefault(questionBase => questionBase.Id == questionBaseId);

        if (wantedQuestionBase != null)
        {
            return wantedQuestionBase.Name;
        }

        await _context.QuestionBasesWithQuestionCount
            .Where(usedQuestionBase => usedQuestionBase.QuestionBaseId == questionBaseId)
            .ExecuteDeleteAsync(ct);

        return null;
    }

    private async Task<List<QuestionBaseData>> GetUserQuestionBaseDatas(CancellationToken ct)
    {
        var userId = User.GetId();

        var userQuestionBases = await _context.QuestionBases
            .Include(questionBase => questionBase.Questions)
            .Where(questionBase => questionBase.OwnerId == userId)
            .ToListAsync(ct);

        if (userQuestionBases == null || userQuestionBases.Count == 0)
        {
            return [];
        }

        return userQuestionBases
            .Select(qb => new QuestionBaseData(qb.Id, qb.Name, qb.Questions.Count))
            .ToList();
    }

    private async Task<Test?> GetTestDb(Guid testId, CancellationToken ct)
    {
        var userId = User.GetId();

        var testDb = await _context.Tests
            .Include(test => test.Options)
            .ThenInclude(options => options!.UsedQuestionBasesWithQuestionCounts)
            .Where(test => test.Id == testId && test.OwnerId == userId)
            .FirstOrDefaultAsync(ct);

        return testDb;
    }
}
