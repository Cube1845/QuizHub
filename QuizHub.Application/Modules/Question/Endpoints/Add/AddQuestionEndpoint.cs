using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Add;

public class AddQuestionEndpoint(IAppDbContext context, IImageService imageService) : IdentifiedEndpoint<AddQuestionRequest, Result>
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
        var questionBaseCorrect = await _context.QuestionBases
            .AnyAsync(questionBase => 
                questionBase.Id == req.QuestionBaseId &&
                questionBase.OwnerId == GetUserId()
            , ct);

        if (!questionBaseCorrect)
        {
            await SendOkAsync(Result.Error("Błąd danych"), ct);
            return;
        }

        var contentImageId = await AddImageIfNotNullAndGetIdWithoutSavingAsync(req.Question.Image, ct);

        var questionDb = ConvertToQuestionDb(req.Question, req.QuestionBaseId, contentImageId);

        _context.Questions.Add(questionDb);

        foreach (var answer in req.Question.Answers)
        {
            var answerImageId = await AddImageIfNotNullAndGetIdWithoutSavingAsync(answer.Image, ct);

            var answerDb = ConvertToAnswerDb(answer, questionDb.Id, answerImageId);
            _context.Answers.Add(answerDb);
        }

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }

    private async Task<Guid?> AddImageIfNotNullAndGetIdWithoutSavingAsync(IFormFile? image, CancellationToken ct = default)
    {
        return image != null ?
            await _imageService.AddImageAndGetIdWithoutSavingAsync(image, ct) :
            null;
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
