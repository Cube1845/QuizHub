using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Application.Modules.Question.Models;
using QuizHub.Domain.Entities;
using static System.Net.Mime.MediaTypeNames;

namespace QuizHub.Application.Modules.Question.Endpoints.Update;

public class UpdateQuestionEndpoint(IAppDbContext context, IImageService imageService) : IdentifiedEndpoint<UpdateQuestionRequest, Result>
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
        var questionDb = await _context.QuestionBases
            .GetQuestionWithIncludedAnswersAsync(GetUserId(), req.QuestionBaseId, req.Question.Id, ct);

        if (questionDb == null)
        {
            await SendOkAsync(Result.Error("Błąd danych"), ct);
            return;
        }

        foreach (var answer in req.Question.Answers)
        {
            var isAnswerNew = answer.Id == null;

            if (isAnswerNew)
            {
                continue;
            }
            
            var currentAnswerDb = questionDb.Answers.FirstOrDefault(answerDb => answerDb.Id == answer.Id) ??
                throw new Exception("Błąd danych odpowiedzi");

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
                var image = await answer.Image.ToImageDbAsync(ct);
                _context.Images.Add(image);

                answerImageId = image.Id;
            }

            var answerToAdd = new Answer(questionId, answer.Content, answer.IsCorrect, answerImageId);
            _context.Answers.Add(answerToAdd);
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

    private async Task<Guid?> HandleAllCasesOfImageEditionAndGetImageIdAsync(IFormFile? image, bool imageRemoved, Guid? imageId, CancellationToken ct = default)
    {
        if (imageRemoved)
        {
            _context.Images
                .Where(image => image.Id == imageId)
                .ExecuteDelete();

            return null;
        }
        else if (image != null)
        {
            if (imageId != null)
            {
                var imageDb = await _context.Images.FirstOrDefaultAsync(image => image.Id == imageId, ct) ??
                    throw new Exception("Błąd danych obrazu");

                imageDb.Update(await image.ToImageDbAsync(ct));

                return null;
            }
            else
            {
                var imageDb = await image.ToImageDbAsync(ct);
                _context.Images.Add(imageDb);

                return imageDb.Id;
            }
        }

        return imageId;
    }

    private List<Guid> GetAllNotNullAnswerIdsFromQuestionUpdateDTO(List<IdentifiedAnswerUpdateDTO> answers)
    {
        return answers
            .Where(answer => answer.Id != null)
            .Select(answer => answer.Id!.Value)
            .ToList();
    }
}
