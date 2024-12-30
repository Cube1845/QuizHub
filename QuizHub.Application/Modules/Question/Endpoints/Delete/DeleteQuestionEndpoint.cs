using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Domain.Entities;

namespace QuizHub.Application.Modules.Question.Endpoints.Delete;

public class DeleteQuestionEndpoint(IAppDbContext context, IImageService imageService) : Endpoint<DeleteQuestionRequest, Result>
{
    private readonly IAppDbContext _context = context;
    private readonly IImageService _imageService = imageService;

    public override void Configure()
    {
        Delete("question");
    }

    public override async Task HandleAsync(DeleteQuestionRequest req, CancellationToken ct)
    {
        var userId = this.GetUserId();

        var question = await _context.QuestionBases
            .GetQuestionWithIncludedAnswersAsync(userId, req.QuestionBaseId, req.QuestionId, ct);

        if (question == null)
        {
            await SendOkAsync(Result.Error("Błąd danych"), ct);
            return;
        }

        foreach (var answer in question.Answers)
        {
            if (answer.ImageId != null)
            {
                await _imageService.RemoveImageWithoutSavingAsync(answer.ImageId!.Value, ct);
            }

            _context.Answers.Remove(answer);
        }

        if (question.ImageId != null)
        {
            await _imageService.RemoveImageWithoutSavingAsync(question.ImageId!.Value, ct);
        }

        _context.Questions.Remove(question);

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }
}
