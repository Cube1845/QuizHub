using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Application.Modules.Question.Models;
using QuizHub.Domain.Entities;

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

        foreach (var answer in req.Question.Answers)
        {
            if (answer.Id == null)
            {
                continue;
            }
            
            var currentAnswerDb = questionDb.Answers.First(answerDb => answerDb.Id == answer.Id);

            await ModifyExistingAnswerAsync(answer, currentAnswerDb, ct);
        }

        if (req.Question.Answers.Count > questionDb.Answers.Count)
        {
            var newAnswers = req.Question.Answers
                .Where(answer => answer.Id == null)
                .ToList();

            AddNewAnswer(newAnswers, questionDb.Id, ct);
        }
        else if (req.Question.Answers.Count < questionDb.Answers.Count)
        {
            RemoveAllAnswersNotIncludedInUpdateDTO(req.Question.Answers, questionDb);
        }

        var contentImageId = await
            HandleAllCasesOfImageEditionForQuestionAndGetImageIdAsync(req.Question, questionDb, ct);

        questionDb.Update(req.Question.Content, req.Question.QuestionType, contentImageId);

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }

    private async void AddNewAnswer(List<IdentifiedAnswerUpdateDTO> answers, Guid questionId, CancellationToken ct = default)
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

    private void RemoveAllAnswersNotIncludedInUpdateDTO(List<IdentifiedAnswerUpdateDTO> answers, Domain.Entities.Question questionDb)
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

    private async Task ModifyExistingAnswerAsync(IdentifiedAnswerUpdateDTO dto, Answer answerDb, CancellationToken ct = default)
    {
        var imageId = await HandleAllCasesOfImageEditionForAnswersAndGetImageIdAsync(dto, answerDb, ct);
        answerDb.Update(dto.Content, dto.IsCorrect, imageId);
    }

    private async Task<Guid?> HandleAllCasesOfImageEditionForAnswersAndGetImageIdAsync(IdentifiedAnswerUpdateDTO dto, Answer answerDb, CancellationToken ct = default)
    {   
        return await
            HandleAllCasesOfImageEditionAndGetImageIdAsync(dto.Image, dto.ImageRemoved, answerDb.ImageId, ct);
    }

    private async Task<Guid?> HandleAllCasesOfImageEditionForQuestionAndGetImageIdAsync(IdentifiedQuestionUpdateDTO dto, Domain.Entities.Question questionDb, CancellationToken ct = default)
    {
        return await
            HandleAllCasesOfImageEditionAndGetImageIdAsync(dto.Image, dto.ImageRemoved, questionDb.ImageId, ct);
    }

    private async Task<Guid?> HandleAllCasesOfImageEditionAndGetImageIdAsync(IFormFile? image, bool imageRemoved, Guid? imageDbId, CancellationToken ct = default)
    {
        if (imageRemoved && imageDbId != null)
        {
            await _imageService.RemoveImageWithoutSavingAsync(imageDbId!.Value, ct);

            return null;
        }
        else if (image != null)
        {
            if (imageDbId != null)
            {
                var imageDb = await _imageService.GetImageByIdAsync(imageDbId!.Value, ct) ??
                    throw new Exception("Błąd danych obrazu");

                imageDb.Update(await image.ToImageDbAsync(ct));

                return null;
            }
            else
            {
                return await _imageService.AddImageAndGetIdWithoutSavingAsync(image, ct);
            }
        }

        return imageDbId;
    }

    private List<Guid> GetAllNotNullAnswerIdsFromQuestionUpdateDTO(List<IdentifiedAnswerUpdateDTO> answers)
    {
        return answers
            .Where(answer => answer.Id != null)
            .Select(answer => answer.Id!.Value)
            .ToList();
    }
}
