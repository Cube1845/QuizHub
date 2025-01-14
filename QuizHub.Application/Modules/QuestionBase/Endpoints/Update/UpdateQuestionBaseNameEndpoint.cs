using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Update;

public class UpdateQuestionBaseNameEndpoint(IAppDbContext context) : Endpoint<UpdateQuestionBaseNameRequest, Result>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Put("question-base");
    }

    public override async Task HandleAsync(UpdateQuestionBaseNameRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var questionBase = await _context.QuestionBases
            .FirstOrDefaultAsync(qb => 
                qb.Id == req.QuestionBaseId &&
                qb.OwnerId == userId
            , ct);

        if (questionBase == null)
        {
            await SendOkAsync(Result.Error("Błąd danych"), ct);
            return;
        }

        questionBase.Name = req.UpdatedName;

        await _context.SaveChangesAsync(ct);
        await SendOkAsync(Result.Success(), ct);
    }
}
