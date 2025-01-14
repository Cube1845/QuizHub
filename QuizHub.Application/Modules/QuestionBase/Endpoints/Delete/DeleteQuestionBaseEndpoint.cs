using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Delete;

public class DeleteQuestionBaseEndpoint(IAppDbContext context) : Endpoint<DeleteQuestionBaseRequest, Result>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Delete("question-base/{QuestionBaseId}");
    }

    public override async Task HandleAsync(DeleteQuestionBaseRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var questionBase = await _context.QuestionBases
            .FirstOrDefaultAsync(questionBase =>
                questionBase.Id == req.QuestionBaseId &&
                questionBase.OwnerId == userId
            , ct);

        if (questionBase == null)
        {
            await SendOkAsync(Result.Error("Błąd danych"), ct);
            return;
        }

        _context.QuestionBases.Remove(questionBase);
        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }
}
