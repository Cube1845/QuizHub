using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Domain.Entities;

namespace QuizHub.Application.Modules.Question.Endpoints.Delete;

public class DeleteQuestionEndpoint(IAppDbContext context) : Endpoint<DeleteQuestionRequest, Result>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Delete("question");
    }

    public override async Task HandleAsync(DeleteQuestionRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var question = await _context.QuestionBases
            .GetQuestionWithIncludedAnswers(userId, req.QuestionBaseId, req.QuestionId, ct);

        if (question == null)
        {
            await SendOkAsync(Result.Error("Błąd danych"), ct);
            return;
        }

        foreach (var answer in question.Answers)
        {
            if (answer.ImageId != null)
            {
                await _context.Images
                    .Where(image => image.Id == answer.ImageId)
                    .ExecuteDeleteAsync(ct);
            }

            _context.Answers.Remove(answer);
        }

        if (question.ImageId != null)
        {
            await _context.Images
                    .Where(image => image.Id == question.ImageId)
                    .ExecuteDeleteAsync(ct);
        }

        _context.Questions.Remove(question);

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }
}
