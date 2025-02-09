using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Client.Models;
using QuizHub.Domain.Entities;

namespace QuizHub.Application.Modules.Client.Endpoints.Begin;

public class BeginTestEndpoint(IAppDbContext context) : Endpoint<BeginTestRequest, Result<BeginTestResponse>>
{
    private readonly IAppDbContext _context = context;

    private const string GeneralErrorMessage = "Nie można teraz rozwiązać tego testu";

    public override void Configure()
    {
        Post("client/test");
        AllowAnonymous();
    }

    public override async Task HandleAsync(BeginTestRequest req, CancellationToken ct)
    {
        var testDb = await GetTestDb(req.Code, ct);

        if (testDb == null)
        {
            return;
        }

        var usedQuestionBasesDb = testDb.Options!.UsedQuestionBasesWithQuestionCounts.ToList();

        if (usedQuestionBasesDb == null || usedQuestionBasesDb.Count == 0)
        {
            await SendOkAsync(Result<BeginTestResponse>.Error(GeneralErrorMessage), ct);
            return;
        }

        var usedQuestionBasesWithQuestionCounts = await GetQuestionBasesQuestionCounts(usedQuestionBasesDb, ct);

        var drawnQuestionIds = GetRandomQuestionIds(usedQuestionBasesWithQuestionCounts, testDb.Options!.QuestionCount);

        if (drawnQuestionIds == null)
        {
            await SendOkAsync(Result<BeginTestResponse>.Error(GeneralErrorMessage), ct);
            return;
        }

        TestSolving solving = new(testDb.Id, drawnQuestionIds, req.Username);

        await _context.TestSolvings.AddAsync(solving, ct);
        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result<BeginTestResponse>.Success(new(solving.Id)), ct);
    }

    private List<Guid>? GetRandomQuestionIds(List<QuestionBaseInfoDto> usedQuestionBaseDtos, int generalQuestionCount)
    {
        List<Guid> drawnQuestionIds = [];

        drawnQuestionIds.AddRange(HandleMinimalCounts(usedQuestionBaseDtos));

        if (drawnQuestionIds.Count < generalQuestionCount)
        {
            List<Guid> leftOverIds = [];

            foreach (var usedQuestionBase in usedQuestionBaseDtos)
            {
                var notUsedIds = usedQuestionBase.QuestionIds.Where(id => !drawnQuestionIds.Contains(id)).ToList();
                leftOverIds.AddRange(notUsedIds);
            }

            var countLeft = generalQuestionCount - drawnQuestionIds.Count;

            if (leftOverIds.Count < countLeft)
            {
                return null;
            }

            var indexes = DrawQuestionIndexes(countLeft, leftOverIds.Count);

            var drawnIds = indexes.Select(index => leftOverIds[index]);

            drawnQuestionIds.AddRange(drawnIds);
        }

        return drawnQuestionIds;
    }

    private List<Guid> HandleMinimalCounts(List<QuestionBaseInfoDto> questionBaseInfos)
    {
        List<Guid> drawnQuestionIds = [];

        foreach (var usedQuestionBaseInfoDto in questionBaseInfos)
        {
            if (usedQuestionBaseInfoDto.SpecifiedMinimalCount == null)
            {
                continue;
            }

            var randomIndexes =
                DrawQuestionIndexes(usedQuestionBaseInfoDto.SpecifiedMinimalCount.Value, usedQuestionBaseInfoDto.QuestionIds.Count);

            var questionIds = randomIndexes.Select(index => usedQuestionBaseInfoDto.QuestionIds[index]).ToList();

            drawnQuestionIds.AddRange(questionIds);
        }

        return drawnQuestionIds;
    }

    private List<int> DrawQuestionIndexes(int count, int size)
    {
        List<int> indexes = [];

        for (int i = 0; i < count; i++)
        {
            int index;

            do
            {
                index = Random.Shared.Next(0, size);
            }
            while (indexes.Contains(index));

            indexes.Add(index);
        }

        return indexes;
    }

    private async Task<List<QuestionBaseInfoDto>> GetQuestionBasesQuestionCounts(List<Domain.Entities.QuestionBaseWithQuestionCount> questionBasesDb, CancellationToken ct)
    {
        var questionBasesIds = questionBasesDb.Select(qb => qb.QuestionBaseId);

        var result = await _context.QuestionBases
            .Include(qb => qb.Questions)
            .Where(qb => questionBasesIds.Contains(qb.Id))
            .Select(qb => new QuestionBaseInfoDto
            {
                QuestionBaseId = qb.Id,
                QuestionIds = qb.Questions.Select(qb => qb.Id).ToList(),
                SpecifiedMinimalCount = 
                    questionBasesDb.First(qbdb => qbdb.QuestionBaseId == qb.Id).MinimalQuestionCount
            })
            .ToListAsync(ct);

        return result;
    }

    private async Task<Domain.Entities.Test?> GetTestDb(string testCode, CancellationToken ct)
    {
        var testDb = await _context.Tests
            .Include(test => test.Options)
            .ThenInclude(options => options!.UsedQuestionBasesWithQuestionCounts)
            .FirstOrDefaultAsync(test => test.Code == testCode, ct);

        if (testDb == null || testDb.Options == null)
        {
            await SendOkAsync(Result<BeginTestResponse>.Error("Taki test nie istnieje"), ct);
            return null;
        }

        if (!testDb.IsActive)
        {
            await SendOkAsync(Result<BeginTestResponse>.Error(GeneralErrorMessage), ct);
            return null;
        }

        return testDb;
    } 
}
