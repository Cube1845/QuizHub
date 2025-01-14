using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Modules.Question.Models;
using QuizHub.Domain.Entities;
using System.IO.Compression;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Export;

public class ExportQuestionBaseEndpoint(IAppDbContext context) : Endpoint<ExportQuestionBaseRequest>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("/question-base/file/{QuestionBaseId}");
    }

    public override async Task HandleAsync(ExportQuestionBaseRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var questionBase = await _context.QuestionBases
            .Include(qb => qb.Questions)
            .ThenInclude(q => q.Answers)
            .FirstOrDefaultAsync(qb => 
                qb.Id == req.QuestionBaseId &&
                qb.OwnerId == userId
            , ct);

        if (questionBase == null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        var questionBaseDto = ConvertToQuestionBaseDto(questionBase);

        var imagesDb = await GetAllImagesFromQuestionBaseDb(questionBase, ct);

        await SendZipFile(questionBaseDto, imagesDb, questionBaseDto.Name, ct);
    }

    private async Task SendZipFile(FileManagementQuestionBaseDto questionBaseDto, List<Domain.Entities.Image> imagesDb, string questionBaseName, CancellationToken ct)
    {
        using var memoryStream = new MemoryStream();
        using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, leaveOpen: true))
        {
            var serializedQuestionBase = JsonConvert.SerializeObject(questionBaseDto);
            var jsonEntry = archive.CreateEntry("data.json");

            using (var writer = new StreamWriter(jsonEntry.Open()))
            {
                writer.Write(serializedQuestionBase);
            }

            const string imagesFolder = "images/";

            foreach (var image in imagesDb)
            {
                var imageExtension = image.ContentType.Split('/')[1];

                var imageEntry = archive.CreateEntry(imagesFolder + image.Id + "." + imageExtension);
                using var imageStream = imageEntry.Open();
                await imageStream.WriteAsync(image.Data, 0, image.Data.Length, ct);
            }
        }

        memoryStream.Position = 0;

        await SendStreamAsync(
            memoryStream,
            fileName: questionBaseName + ".zip",
            contentType: "application/zip",
            cancellation: ct);
    }

    private async Task<List<Domain.Entities.Image>> GetAllImagesFromQuestionBaseDb(Domain.Entities.QuestionBase questionBaseDb, CancellationToken ct)
    {
        var answersId = questionBaseDb.Questions
            .SelectMany(q => q.Answers)
            .Select(a => a.ImageId)
            .Where(id => id != null)
            .ToList();

        var questionIds = questionBaseDb.Questions
            .Select(q => q.ImageId)
            .Where(id => id != null)
            .ToList();

        var imageIds = answersId.Concat(questionIds).ToList();

        if (imageIds.Count == 0)
        {
            return [];
        }

        List<Domain.Entities.Image> questionBaseImages = await _context.Images
            .Where(i => imageIds.Contains(i.Id))
            .ToListAsync(ct);

        return questionBaseImages;
    } 

    private FileManagementQuestionBaseDto ConvertToQuestionBaseDto(Domain.Entities.QuestionBase questionBaseDb)
    {
        var questions = questionBaseDb.Questions
            .Select(ConvertToQuestionDto);

        return new FileManagementQuestionBaseDto(questionBaseDb.Name, questions.ToList());
    }

    private FileManagementQuestionDto ConvertToQuestionDto(Domain.Entities.Question questionDb)
    {
        return new FileManagementQuestionDto
        {
            Content = questionDb.Content,
            ImageId = questionDb.ImageId,
            QuestionType = questionDb.QuestionType,
            Answers = questionDb.Answers
                .Select(ConvertToAnswerDto)
                .ToList()
        };
    }

    private FileManagementAnswerDto ConvertToAnswerDto(Answer answerDb)
    {
        return new FileManagementAnswerDto
        {
            Content = answerDb.Content,
            IsCorrect = answerDb.IsCorrect,
            ImageId = answerDb.ImageId
        };
    }
}
