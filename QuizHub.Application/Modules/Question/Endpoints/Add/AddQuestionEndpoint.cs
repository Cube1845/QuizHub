using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Add;

public class AddQuestionEndpoint(IAppDbContext context, IImageService imageService) : Endpoint<AddQuestionRequest, Result>
{
    private readonly IAppDbContext _context = context;
    private readonly IImageService _imageService = imageService;

    public override void Configure()
    {
        Post("question");
        AllowFileUploads();
    }

    public override async Task HandleAsync(AddQuestionRequest req, CancellationToken ct)
    {
        var userId = this.GetUserId();

        var questionBaseCorrect = await _context.QuestionBases
            .AnyAsync(questionBase =>
                questionBase.Id == req.QuestionBaseId &&
                questionBase.OwnerId == userId
            , ct);

        if (!questionBaseCorrect)
        {
            await SendOkAsync(Result.Error("Błąd danych"), ct);
            return;
        }

        var processedAnswerImageFiles = new List<IFormFile?>(
        [
            req.AnswerImage1,
            req.AnswerImage2,
            req.AnswerImage3,
            req.AnswerImage4
        ]);

        UnidentifiedQuestion question = new(req.Question, req.ContentImage, processedAnswerImageFiles);

        var contentImageId = await AddImageIfNotNullAndGetIdWithoutSavingAsync(question.Image, ct);

        var questionDb = ConvertToQuestionDb(question, req.QuestionBaseId, contentImageId);

        await _context.Questions.AddAsync(questionDb, ct);

        foreach (var answer in question.Answers)
        {
            var answerImageId = await AddImageIfNotNullAndGetIdWithoutSavingAsync(answer.Image, ct);

            var answerDb = ConvertToAnswerDb(answer, questionDb.Id, answerImageId);
            await _context.Answers.AddAsync(answerDb, ct);
        }

        await _context.SaveChangesAsync(ct);
        await _imageService.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }

    private async Task<Guid?> AddImageIfNotNullAndGetIdWithoutSavingAsync(IFormFile? image, CancellationToken ct = default)
    {
        if (image == null)
        {
            return null;
        }

        return await _imageService.AddImageAndGetIdWithoutSavingAsync(image, ct);
    }

    private Domain.Entities.Question ConvertToQuestionDb(UnidentifiedQuestion question, Guid questionBaseId, Guid? imageId)
    {
        return new Domain.Entities.Question(
            Guid.Empty,
            questionBaseId,
            question.Content,
            question.QuestionType,
            imageId
        );
    }

    private Answer ConvertToAnswerDb(UnidentifiedAnswer answer, Guid questionId, Guid? imageId)
    {
        return new Answer(
            questionId,
            answer.Content,
            answer.IsCorrect,
            imageId
        );
    }
}
