using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Application.Modules.Question.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Update;

public class UpdateQuestionEndpoint(IAppDbContext context) : IdentifiedEndpoint<UpdateQuestionRequest, Result>
{
    private readonly IAppDbContext _context = context;

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

            if (!isAnswerNew)
            {
                var currentAnswerDb = questionDb.Answers
                    .FirstOrDefault(answerDb => answerDb.Id == answer.Id);

                if (currentAnswerDb == null)
                {
                    await SendOkAsync(Result.Error("Błąd danych odpowiedzi"), ct);
                    return;
                }

                currentAnswerDb = answer.ToAnswerDb(currentAnswerDb.QuestionId);

                if (answer.Image != null && currentAnswerDb.Image == null)
                {
                    var answerImage = await answer.Image.ToAnswerImageDbAsync(currentAnswerDb.Id, ct);
                    _context.AnswerImages.Add(answerImage!);
                }
                else if (answer.Image != null && currentAnswerDb.Image != null)
                {
                    currentAnswerDb.Image = await answer.Image.ToAnswerImageDbAsync(currentAnswerDb.Id, ct);
                }
                else if (answer.ImageRemoved && currentAnswerDb.Image != null)
                {
                    _context.AnswerImages.Remove(currentAnswerDb.Image);
                }
            }
        }

        if (req.Question.Answers.Count > questionDb.Answers.Count)
        {
            foreach (var answer in req.Question.Answers)
            {
                if (answer.Id != "")
                {
                    continue;
                }

                var answerModel = answer.ToAnswerDb(questionDb.Id);
                _context.Answers.Add(answerModel);

                if (answer.Image == null)
                {
                    continue;
                }

                var answerImage = await answer.Image.ToAnswerImageDbAsync(answerModel.Id, ct);
                _context.AnswerImages.Add(answerImage!);
            }
        } 
        else if (req.Question.Answers.Count < questionDb.Answers.Count)
        {
            var answersToRemove = questionDb.Answers
                .Where(answer => !GetAllAnswerIdsFromQuestionUpdateDTO(req.Question.Answers).Contains(answer.Id));

            foreach (var answer in answersToRemove)
            {
                if (answer.Image != null)
                {
                    _context.AnswerImages.Remove(answer.Image);
                }

                _context.Answers.Remove(answer);
            }
        }

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }

    private List<Guid> GetAllAnswerIdsFromQuestionUpdateDTO(List<IdentifiedAnswerUpdateDTO> answers)
    {
        return answers
            .Where(answer => answer.Id != null)
            .Select(answer => answer.Id!.Value)
            .ToList();
    }
}
