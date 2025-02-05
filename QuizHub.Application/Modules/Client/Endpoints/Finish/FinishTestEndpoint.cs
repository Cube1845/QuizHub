using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Modules.Client.Endpoints.Finish;

public class FinishTestEndpoint(IAppDbContext context) : Endpoint<FinishTestRequest, Result<FinishTestResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Post("client/finish");
        AllowAnonymous();
    }

    public override async Task HandleAsync(FinishTestRequest req, CancellationToken ct)
    {
        var testSolvingDb = await _context.TestSolvings.FirstOrDefaultAsync(ts => ts.Id == req.TestSolvingId, ct);

        if (testSolvingDb == null)
        {
            await SendOkAsync(Result<FinishTestResponse>.Error("Wystąpił nieoczekiwany błąd"), ct);
            return;
        }

        if (!testSolvingDb.QuestionsDownloaded)
        {
            await SendOkAsync(Result<FinishTestResponse>.Error("Wystąpił nieoczekiwany błąd"), ct);
            return;
        }


    }
}
