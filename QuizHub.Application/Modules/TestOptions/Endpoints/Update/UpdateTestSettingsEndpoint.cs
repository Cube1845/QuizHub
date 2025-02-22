using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.TestOptions.Extensions;
using QuizHub.Application.Modules.TestOptions.Models;
using QuizHub.Domain.Entities;

namespace QuizHub.Application.Modules.TestOptions.Endpoints.Update;

public class UpdateTestSettingsEndpoint(IAppDbContext context) : Endpoint<UpdateTestSettingsRequest, Result>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Put("test-options");
    }

    public override async Task HandleAsync(UpdateTestSettingsRequest req, CancellationToken ct)
    {
        var testDb = await _context.Tests.GetTestDb(User.GetId(), req.TestId, ct);

        if (testDb == null)
        {
            await SendOkAsync(Result.Error("Taki test nie istnieje"), ct);
            return;
        }

        var areUsedQuestionBaseMinimalCountsCorrect = 
            await CheckForMinimalQuestionsExceeding(req.UsedQuestionBases, ct);

        if (!areUsedQuestionBaseMinimalCountsCorrect)
        {
            await SendOkAsync(Result.Error("Minimalna ilość pytań w bazie pytań przekracza liczbę dostępnych pytań"), ct);
            return;
        }

        if (testDb.IsActive)
        {
            await SendOkAsync(Result.Error("Nie można edytować testu, ponieważ test jest aktywny"), ct);
            return;
        }

        await HandleUsedQuestionBases(testDb.Options!, req.UsedQuestionBases, ct);

        testDb.Options!.QuestionCount = req.QuestionCount;

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }

    private async Task<bool> CheckForMinimalQuestionsExceeding(List<QuestionBaseWithQuestionCountDto> usedQuestionBases, CancellationToken ct)
    {
        var userQuestionBases = await _context.QuestionBases
            .Include(qb => qb.Questions)
            .Where(qb => qb.OwnerId == User.GetId())
            .ToListAsync(ct);

        foreach (var usedQuestionBase in usedQuestionBases)
        {
            var currentQuestionBaseDb = userQuestionBases
                .FirstOrDefault(qb => qb.Id == usedQuestionBase.QuestionBaseId);

            if (currentQuestionBaseDb == null || currentQuestionBaseDb.Questions.Count < usedQuestionBase.MinimalQuestionCount)
            {
                return false;
            }
        }

        return true;
    }

    private async Task HandleUsedQuestionBases(Domain.Entities.TestOptions testOptionsDb, List<QuestionBaseWithQuestionCountDto> reqUsedQuestionBases, CancellationToken ct)
    {
        var reqQuestionBaseIds = reqUsedQuestionBases.Select(qb => qb.QuestionBaseId).ToList();

        List<Guid> reqHandledQuestionBaseIds = [];

        foreach (var usedQuestionBase in testOptionsDb.UsedQuestionBasesWithQuestionCounts)
        {
            if (reqQuestionBaseIds.Contains(usedQuestionBase.QuestionBaseId))
            {
                usedQuestionBase.MinimalQuestionCount = reqUsedQuestionBases
                    .First(qb => qb.QuestionBaseId == usedQuestionBase.QuestionBaseId).MinimalQuestionCount;

                reqHandledQuestionBaseIds.Add(usedQuestionBase.QuestionBaseId);
            }
            else
            {
                _context.QuestionBasesWithQuestionCount.Remove(usedQuestionBase);
            }
        }

        foreach (var handledId in reqHandledQuestionBaseIds)
        {
            reqQuestionBaseIds.Remove(handledId);
        }

        if (reqQuestionBaseIds.Count == 0)
        {
            return;
        }

        var questionBaseWithCountList = reqQuestionBaseIds
            .Select(questionBaseId =>
            {
                QuestionBaseWithQuestionCount questionBaseWithQuestionCount = new()
                {
                    MinimalQuestionCount = reqUsedQuestionBases
                        .First(qb => qb.QuestionBaseId == questionBaseId).MinimalQuestionCount,
                    TestOptionsId = testOptionsDb.Id,
                    QuestionBaseId = questionBaseId
                };

                return questionBaseWithQuestionCount;
            });

        await _context.QuestionBasesWithQuestionCount.AddRangeAsync(questionBaseWithCountList, ct);
    }
}
