using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Delete;

public class DeleteQuestionBaseEndpoint(IAppDbContext context) : IdentifiedEndpoint<DeleteQuestionBaseRequest, Result>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Delete("question-base/{QuestionBaseId}");
    }

    public override async Task HandleAsync(DeleteQuestionBaseRequest req, CancellationToken ct)
    {
        var questionBase = await _context.QuestionBases
            .FirstOrDefaultAsync(questionBase =>
                questionBase.Id == req.QuestionBaseId &&
                questionBase.OwnerId == GetUserId()
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
