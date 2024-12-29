using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Models;
using static FastEndpoints.Ep;

namespace QuizHub.Application.Modules.Question.Endpoints.Add;

public class AddQuestionEndpoint(IAppDbContext context) : IdentifiedEndpoint<AddQuestionRequest, Result>
{
    private readonly IAppDbContext _context = context;

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

        var contentImageId = await AddImageIfNotNullAndGetIdAsync(req.Question.Image, ct);

        var questionDb = ConvertToQuestionDb(req.Question, req.QuestionBaseId, contentImageId);

        _context.Questions.Add(questionDb);

        foreach (var answer in req.Question.Answers)
        {
            var answerImageId = await AddImageIfNotNullAndGetIdAsync(answer.Image, ct);

            var answerDb = ConvertToAnswerDb(answer, questionDb.Id, answerImageId);
            _context.Answers.Add(answerDb);
        }

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }

    private async Task<Guid?> AddImageIfNotNullAndGetIdAsync(IFormFile? image, CancellationToken ct = default)
    {
        Guid? imageId = null;

        if (image != null)
        {
            var imageDb = await image.ToImageDb(ct);
            _context.Images.Add(imageDb);

            imageId = imageDb.Id;
        }

        return imageId;
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
