using Newtonsoft.Json;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.QuestionBase.Models;
using QuizHub.Domain.Entities;
using System.IO.Compression;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Import;

public class ImportQuestionBaseEndpoint(IAppDbContext context) : Endpoint<ImportQuestionBaseRequest, Result<ImportQuestionBaseResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Post("/question-base/file");
        AllowFileUploads();
    }

    public override async Task HandleAsync(ImportQuestionBaseRequest req, CancellationToken ct)
    {
        using var zipStream = req.QuestionBaseZip.OpenReadStream();
        using ZipArchive archive = new(zipStream, ZipArchiveMode.Read);

        var questionBaseDto = await GetQuestionBaseDto(archive, ct);

        foreach (ZipArchiveEntry entry in archive.Entries)
        {
            var extension = Path.GetExtension(entry.Name).ToLowerInvariant();

            if (entry.FullName.StartsWith("images/") &&
                FileExtensionsHelper.GetImageExtensions().Contains(extension))
            {
                if (!Guid.TryParse(entry.Name.Split('.')[0], out var oldImageId))
                {
                    await SendOkAsync(Result<ImportQuestionBaseResponse>.Error("Błąd nazwy pliku z obrazem"), ct);
                    return;
                }

                var newImageId = await AddImageToDb(entry, extension, ct);

                questionBaseDto = UpdateImageId(questionBaseDto, oldImageId, newImageId);
            }
        }

        var questionBaseId = await ImportQuestionBaseToDb(questionBaseDto, ct);

        await SendOkAsync(Result<ImportQuestionBaseResponse>.Success(new(questionBaseId)), ct);
    }

    private async Task<Guid> ImportQuestionBaseToDb(FileManagementQuestionBaseDto dto, CancellationToken ct)
    {
        var userId = User.GetId();

        Domain.Entities.QuestionBase questionBase = new()
        {
            OwnerId = userId,
            Name = dto.Name,
        };

        await _context.QuestionBases.AddAsync(questionBase, ct);

        await AddQuestionsAndAnswersToDb(dto.Questions, questionBase.Id, ct);

        await _context.SaveChangesAsync(ct);

        return questionBase.Id;
    }

    private async Task AddQuestionsAndAnswersToDb(List<FileManagementQuestionDto> questions, Guid questionBaseId, CancellationToken ct)
    {
        foreach (var question in questions)
        {
            Domain.Entities.Question questionToAdd =
                new(questionBaseId, question.Content, question.QuestionType, question.ImageId);

            await _context.Questions.AddAsync(questionToAdd, ct);

            foreach (var answer in question.Answers)
            {
                Answer answerToAdd =
                    new(questionToAdd.Id, answer.Content, answer.IsCorrect, answer.ImageId);

                await _context.Answers.AddAsync(answerToAdd, ct);
            }
        }
    }

    private FileManagementQuestionBaseDto UpdateImageId(FileManagementQuestionBaseDto dto, Guid oldImageId, Guid newImageId)
    {
        for (int i = 0; i < dto.Questions.Count; i++) 
        {
            if (dto.Questions[i].ImageId == oldImageId)
            {
                dto.Questions[i].ImageId = newImageId;
                return dto;
            }

            for (int j = 0; j < dto.Questions[i].Answers.Count; j++)
            {
                if (dto.Questions[i].Answers[j].ImageId == oldImageId)
                {
                    dto.Questions[i].Answers[j].ImageId = newImageId;
                    return dto;
                }
            }
        }

        return dto;
    }

    private async Task<FileManagementQuestionBaseDto> GetQuestionBaseDto(ZipArchive archive, CancellationToken ct)
    {
        var dataEntry = archive.GetEntry("data.json")
            ?? throw new DomainException("W pliku brakuje danych");

        using var dataStream = dataEntry.Open();
        using StreamReader reader = new(dataStream);

        var dataContent = await reader.ReadToEndAsync(ct);

        var questionBaseDto = 
            JsonConvert.DeserializeObject<FileManagementQuestionBaseDto>(dataContent)
            ?? throw new DomainException("Plik z danymi został uszkodzony");

        return questionBaseDto;
    }

    private async Task<Guid> AddImageToDb(ZipArchiveEntry entry, string extension, CancellationToken ct)
    {
        using var imageStream = entry.Open();
        using var memoryStream = new MemoryStream();

        await imageStream.CopyToAsync(memoryStream, ct);
        var contentType = FileExtensionsHelper.ConvertExtensionToContentType(extension);

        Domain.Entities.Image image = new()
        {
            ContentType = contentType,
            Data = memoryStream.ToArray()
        };

        await _context.Images.AddAsync(image, ct);
        return image.Id;
    }
}
