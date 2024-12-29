using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Extensions;

namespace QuizHub.Application.Modules.Question.Endpoints.Delete;

public class DeleteQuestionEndpoint(IAppDbContext context) : IdentifiedEndpoint<DeleteQuestionRequest, Result>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Delete("question");
    }

    public override async Task HandleAsync(DeleteQuestionRequest req, CancellationToken ct)
    {
        var question = await _context.QuestionBases
            .GetQuestionWithIncludedAnswersAsync(GetUserId(), req.QuestionBaseId, req.QuestionId, ct);

        if (question == null)
        {
            await SendOkAsync(Result.Error("Błąd danych"), ct);
            return;
        }

        foreach (var answer in question.Answers)
        {
            if (answer.ImageId != null)
            {
                _context.Images
                    .Where(i => i.Id == answer.ImageId)
                    .ExecuteDelete();
            }

            _context.Answers.Remove(answer);
        }

        if (question.ImageId != null)
        {
            _context.Images
                .Where(i => i.Id == question.ImageId)
                .ExecuteDelete();
        }

        _context.Questions.Remove(question);

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }
}
