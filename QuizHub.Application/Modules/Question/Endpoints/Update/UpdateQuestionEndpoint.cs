using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Endpoints.Update.Models;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Enums;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Update;

public class UpdateQuestionEndpoint(IAppDbContext context, IImageService imageService) : Endpoint<UpdateQuestionRequest, Result>
{
    private readonly IAppDbContext _context = context;
    private readonly IImageService _imageService = imageService;

    public override void Configure()
    {
        Put("question");
        AllowFileUploads();
    }

    public override async Task HandleAsync(UpdateQuestionRequest req, CancellationToken ct)
    {
        var userId = this.GetUserId();

        var questionDb = await _context.QuestionBases
            .GetQuestionWithIncludedAnswersAsync(userId, req.QuestionBaseId, req.Question.Id, ct);

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

        IdentifiedQuestionMappedUpdateDTO question = new(req.Question, req.ContentImage, processedAnswerImageFiles);
        
        foreach (var answer in question.Answers)
        {
            if (answer.Id == null)
            {
                continue;
            }
            
            var currentAnswerDb = questionDb.Answers.First(answerDb => answerDb.Id == answer.Id);

            await ModifyExistingAnswerAsync(answer, currentAnswerDb, ct);
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
            RemoveAllAnswersNotIncludedInUpdateDTO(question.Answers, questionDb);
        }

        var contentImageId = await
            HandleAllCasesOfImageEditionForQuestionAndGetImageIdAsync(question, questionDb, ct);

        questionDb.Update(req.Question.Content, req.Question.QuestionType, contentImageId);

        await _context.SaveChangesAsync(ct);
        await _imageService.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }

    private async void AddNewAnswer(List<IdentifiedAnswerMappedUpdateDTO> answers, Guid questionId, CancellationToken ct = default)
    {
        foreach (var answer in answers)
        {
            Guid? answerImageId = null;

            if (answer.Image != null)
            {
                answerImageId = await _imageService.AddImageAndGetIdWithoutSavingAsync(answer.Image, ct);
            }

            Answer answerToAdd = new(questionId, answer.Content, answer.IsCorrect, answerImageId);
            await _context.Answers.AddAsync(answerToAdd, ct);
        }
    }

    private void RemoveAllAnswersNotIncludedInUpdateDTO(List<IdentifiedAnswerMappedUpdateDTO> answers, Domain.Entities.Question questionDb)
    {
        var answerIdsFromRequest = GetAllNotNullAnswerIdsFromQuestionUpdateDTO(answers);

        foreach (var answer in questionDb.Answers)
        {
            if (!answerIdsFromRequest.Contains(answer.Id))
            {
                _context.Answers.Remove(answer);
            }
        }
    }

    private async Task ModifyExistingAnswerAsync(IdentifiedAnswerMappedUpdateDTO dto, Answer answerDb, CancellationToken ct = default)
    {
        var imageId = await HandleAllCasesOfImageEditionForAnswersAndGetImageIdAsync(dto, answerDb, ct);
        answerDb.Update(dto.Content, dto.IsCorrect, imageId);
    }

    private async Task<Guid?> HandleAllCasesOfImageEditionForAnswersAndGetImageIdAsync(IdentifiedAnswerMappedUpdateDTO dto, Answer answerDb, CancellationToken ct = default)
    {   
        return await
            HandleAllCasesOfImageEditionAndGetImageIdAsync(dto.Image, dto.ImageEditionState, answerDb.ImageId, ct);
    }

    private async Task<Guid?> HandleAllCasesOfImageEditionForQuestionAndGetImageIdAsync(IdentifiedQuestionMappedUpdateDTO dto, Domain.Entities.Question questionDb, CancellationToken ct = default)
    {
        return await
            HandleAllCasesOfImageEditionAndGetImageIdAsync(dto.Image, dto.ImageEditionState, questionDb.ImageId, ct);
    }

    private async Task<Guid?> HandleAllCasesOfImageEditionAndGetImageIdAsync(IFormFile? image, ImageEditionState imageState, Guid? imageDbId, CancellationToken ct = default)
    {
        if (imageState == ImageEditionState.Untouched)
        {
            return imageDbId;
        }
        else if (imageState == ImageEditionState.Removed && imageDbId != null)
        {
            await _imageService.RemoveImageWithoutSavingAsync(imageDbId!.Value, ct);

            return null;
        }
        else if (imageState == ImageEditionState.Modified && image != null)
        {
            if (imageDbId != null)
            {
                var imageDb = await _imageService.GetImageByIdAsync(imageDbId!.Value, ct) ??
                    throw new DomainException("Błąd danych obrazu");

                var imageModel = await image.ToImageDbAsync(ct);
                imageDb.Update(imageModel.Data, imageModel.ContentType);

                return imageDb.Id;
            }
            else
            {
                return await _imageService.AddImageAndGetIdWithoutSavingAsync(image, ct);
            }
        }

        return imageDbId;
    }

    private List<Guid> GetAllNotNullAnswerIdsFromQuestionUpdateDTO(List<IdentifiedAnswerMappedUpdateDTO> answers)
    {
        return answers
            .Where(answer => answer.Id != null)
            .Select(answer => answer.Id!.Value)
            .ToList();
    }
}
