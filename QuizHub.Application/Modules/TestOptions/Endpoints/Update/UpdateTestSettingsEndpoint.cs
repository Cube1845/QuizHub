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
        var testOptionsDb = await _context.Tests.GetTestOptions(req.TestId, User.GetId(), ct);

        if (testOptionsDb == null)
        {
            await SendOkAsync(Result.Error("Taki test nie istnieje"), ct);
            return;
        }

        await HandleUsedQuestionBases(testOptionsDb, req.UsedQuestionBases, ct);

        testOptionsDb.QuestionCount = req.QuestionCount;

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
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

        foreach (var questionBaseId in reqQuestionBaseIds)
        {
            QuestionBaseWithQuestionCount questionBaseWithQuestionCount = new()
            {
                MinimalQuestionCount = reqUsedQuestionBases
                    .First(qb => qb.QuestionBaseId == questionBaseId).MinimalQuestionCount,
                TestOptionsId = testOptionsDb.Id,
                QuestionBaseId = questionBaseId
            };

            await _context.QuestionBasesWithQuestionCount.AddAsync(questionBaseWithQuestionCount, ct);
        }
    }
}
