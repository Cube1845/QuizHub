using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.TestOptions.Endpoints.Get;
using QuizHub.Domain.Services;

namespace QuizHub.Application.Modules.TestOptions.Endpoints.Code;

public class ChangeTestCodeEndpoint(IAppDbContext context) : Endpoint<ChangeTestCodeRequest, Result<ChangeTestCodeResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Put("test-options/code");
    }

    public override async Task HandleAsync(ChangeTestCodeRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var testDb = await _context.Tests
            .FirstOrDefaultAsync(test => test.OwnerId == userId && test.Id == req.TestId, ct);

        if (testDb == null)
        {
            await SendOkAsync(Result<ChangeTestCodeResponse>.Error("Taki test nie istnieje"), ct);
            return;
        }

        var newCode = CodeService.GenerateCode();
        testDb.Code = newCode;

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result<ChangeTestCodeResponse>.Success(new(newCode)), ct);
    }
}
