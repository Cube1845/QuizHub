using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.TestOptions.Extensions;

namespace QuizHub.Application.Modules.TestOptions.Endpoints.Activity;

public class ChangeTestActiveStateEndpoint(IAppDbContext context) : Endpoint<ChangeTestActiveStateRequest, Result>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Put("test-options/activity");
    }

    public override async Task HandleAsync(ChangeTestActiveStateRequest req, CancellationToken ct)
    {
        var testDb = await _context.Tests.GetTestDb(User.GetId(), req.TestId, ct);

        if (testDb == null)
        {
            await SendOkAsync(Result.Error("Taki test nie istnieje"), ct);
            return;
        }

        if (testDb.Options!.UsedQuestionBasesWithQuestionCounts.Count == 0)
        {
            await SendOkAsync(Result.Error("Nie można zaaktywować testu, ponieważ nie ma on wybranej żadnej bazy pytań"), ct);
            return;
        }

        testDb.ToggleActiveState();

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }
}
