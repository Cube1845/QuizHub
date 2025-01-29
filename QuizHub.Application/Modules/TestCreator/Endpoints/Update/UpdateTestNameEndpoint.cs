using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Modules.TestCreator.Endpoints.Update;

public class UpdateTestNameEndpoint(IAppDbContext context) : Endpoint<UpdateTestNameRequest, Result>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Put("test");
    }

    public override async Task HandleAsync(UpdateTestNameRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var testDb = await _context.Tests
            .FirstOrDefaultAsync(test => test.Id == req.TestId && test.OwnerId == userId, ct);

        if (testDb == null)
        {
            await SendOkAsync(Result.Error("Taki test nie istnieje"), ct);
            return;
        }

        testDb.Name = req.UpdatedName;

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }
}
