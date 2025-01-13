using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Endpoints.Update.Models;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Enums;

namespace QuizHub.Application.Modules.Question.Endpoints.Update;

public class UpdateQuestionEndpoint(IAppDbContext context) : Endpoint<UpdateQuestionRequest, Result>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Put("question");
        AllowFileUploads();
    }

    public override async Task HandleAsync(UpdateQuestionRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var questionDb = await _context.QuestionBases
            .GetQuestionWithIncludedAnswers(userId, req.QuestionBaseId, req.Question.Id, ct);

        if (questionDb == null)
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

        IdentifiedQuestionMappedUpdateDto question = new(req.Question, req.ContentImage, processedAnswerImageFiles);
        
        foreach (var answer in question.Answers)
        {
            if (answer.Id == null)
            {
                continue;
            }
            
            var currentAnswerDb = questionDb.Answers.First(answerDb => answerDb.Id == answer.Id);

            await ModifyExistingAnswer(answer, currentAnswerDb, ct);
        }

        if (question.Answers.Count > questionDb.Answers.Count)
        {
            var newAnswers = question.Answers
                .Where(answer => answer.Id == null)
                .ToList();

            AddNewAnswer(newAnswers, questionDb.Id, ct);
        }
        else if (question.Answers.Count < questionDb.Answers.Count)
        {
            RemoveAnswersNotIncludedInUpdateDto(question.Answers, questionDb);
        }

        var contentImageId = await
            HandleImageEditionForQuestion(question, questionDb, ct);

        questionDb.Update(req.Question.Content, req.Question.QuestionType, contentImageId);

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }

    private async void AddNewAnswer(List<IdentifiedAnswerMappedUpdateDto> answers, Guid questionId, CancellationToken ct)
    {
        foreach (var answer in answers)
        {
            Guid? answerImageId = null;

            if (answer.Image != null)
            {
                answerImageId = await _context.Images.AddImage(answer.Image, ct);
            }

            Answer answerToAdd = new(questionId, answer.Content, answer.IsCorrect, answerImageId);
            await _context.Answers.AddAsync(answerToAdd, ct);
        }
    }

    private void RemoveAnswersNotIncludedInUpdateDto(List<IdentifiedAnswerMappedUpdateDto> answers, Domain.Entities.Question questionDb)
    {
        var answerIdsFromRequest = GetNotNullAnswerIdsFromUpdateDto(answers);

        foreach (var answer in questionDb.Answers)
        {
            if (!answerIdsFromRequest.Contains(answer.Id))
            {
                _context.Answers.Remove(answer);
            }
        }
    }

    private async Task ModifyExistingAnswer(IdentifiedAnswerMappedUpdateDto dto, Answer answerDb, CancellationToken ct)
    {
        var imageId = await HandleImageEditionForAnswer(dto, answerDb, ct);
        answerDb.Update(dto.Content, dto.IsCorrect, imageId);
    }

    private async Task<Guid?> HandleImageEditionForAnswer(IdentifiedAnswerMappedUpdateDto dto, Answer answerDb, CancellationToken ct)
    {   
        return await
            HandleImageEdition(dto.Image, dto.ImageEditionState, answerDb.ImageId, ct);
    }

    private async Task<Guid?> HandleImageEditionForQuestion(IdentifiedQuestionMappedUpdateDto dto, Domain.Entities.Question questionDb, CancellationToken ct)
    {
        return await
            HandleImageEdition(dto.Image, dto.ImageEditionState, questionDb.ImageId, ct);
    }

    private async Task<Guid?> HandleImageEdition(IFormFile? image, ImageEditionState imageState, Guid? imageDbId, CancellationToken ct)
    {
        switch (imageState)
        {
            case ImageEditionState.Untouched:
                return imageDbId;

            case ImageEditionState.Removed:
                if (imageDbId != null)
                {
                    await _context.Images
                        .Where(image => image.Id == imageDbId)
                        .ExecuteDeleteAsync(ct);
                }
                return null;

            case ImageEditionState.Modified:
                if (image != null)
                {
                    var imageDb = await _context.Images.FirstOrDefaultAsync(image => image.Id == imageDbId, ct) ??
                        throw new DomainException("Błąd danych obrazu");

                    var imageModel = await image.ToImageDb(ct);

                    imageDb.Update(imageModel.Data, imageModel.ContentType);
                    return imageDb.Id;
                }
                else
                {
                    return await _context.Images.AddImage(image, ct);
                }

            default:
                throw new DomainException("Błąd danych obrazu");
        }
    }

    private List<Guid> GetNotNullAnswerIdsFromUpdateDto(List<IdentifiedAnswerMappedUpdateDto> answers)
    {
        return answers
            .Where(answer => answer.Id != null)
            .Select(answer => answer.Id!.Value)
            .ToList();
    }
}
