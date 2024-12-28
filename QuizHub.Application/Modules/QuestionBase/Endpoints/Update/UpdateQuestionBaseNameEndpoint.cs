using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Update;

public class UpdateQuestionBaseNameEndpoint(IAppDbContext context) : IdentifiedEndpoint<UpdateQuestionBaseNameRequest, Result>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Put("question-base");
    }

    public override async Task HandleAsync(UpdateQuestionBaseNameRequest req, CancellationToken ct)
    {
        var questionBase = await _context.QuestionBases
            .FirstOrDefaultAsync(qb => qb.Id == Guid.Parse(req.QuestionBaseId), ct);

        if (questionBase == null)
        {
            await SendOkAsync(Result.Error("Taka baza pytań nie istnieje"), ct);
            return;
        }

        var userId = GetUserId();

        if (questionBase.OwnerId != userId)
        {
            await SendOkAsync(Result.Error("Ta baza pytań nie należy do ciebie"), ct);
            return;
        }

        questionBase.Name = req.UpdatedName;

        await _context.SaveChangesAsync(ct);
        await SendOkAsync(Result.Success(), ct);
    }
}
