using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Modules.TestOptions.Endpoints.Activity;

public class ChangeTestActiveStateEndpoint(IAppDbContext context) : Endpoint<ChangeTestActiveStateRequest, Result<ChangeTestActiveStateResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Put("test-options/activity");
    }

    public override async Task HandleAsync(ChangeTestActiveStateRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var testDb = await _context.Tests
            .FirstOrDefaultAsync(test => test.OwnerId == userId && test.Id == req.TestId, ct);

        if (testDb == null)
        {
            await SendOkAsync(Result<ChangeTestActiveStateResponse>.Error("Taki test nie istnieje"), ct);
            return;
        }

        var newActiveState = !testDb.IsActive;
        testDb.IsActive = newActiveState;

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result<ChangeTestActiveStateResponse>.Success(new(newActiveState)), ct);
    }
}
