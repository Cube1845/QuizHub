using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Add;

public class AddQuestionEndpoint(IAppDbContext context) : IdentifiedEndpoint<AddQuestionRequest, Result<AddQuestionResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Post("question");
        AllowFileUploads();
    }

    public override async Task HandleAsync(AddQuestionRequest req, CancellationToken ct)
    {
        Guid questionBaseId = Guid.Parse(req.QuestionBaseId);

        var questionBaseExists = await _context.QuestionBases
            .AnyAsync(questionBase => questionBase.Id == questionBaseId, ct);

        if (!questionBaseExists)
        {
            await SendOkAsync(Result<AddQuestionResponse>.Error("Taka baza pytań nie istnieje"), ct);
            return;
        }
        
        var answersDb = req.Question.Answers.ToAnswersDb(ct);
        var questionDb = req.Question.ToQuestionDb(questionBaseId, ct);

        _context.Questions.Add(questionDb);

        if (req.Question.Image != null)
        {
            var questionImageDb = await req.Question.Image.ToQuestionImageDbAsync(questionDb.Id ,ct);
            _context.QuestionImages.Add(questionImageDb!);
        }

        AnswerImage? answerImageDb;

        for (int i = 0; i < answersDb.Count; i++)
        {
            answerImageDb = null;

            answersDb[i].QuestionId = questionDb.Id;
            _context.Answers.Add(answersDb[i]);

            if (req.Question.Answers[i].Image != null)
            {
                answerImageDb = await req.Question.Answers[i].Image.ToAnswerImageDbAsync(answersDb[i].Id, ct);
                _context.AnswerImages.Add(answerImageDb!);
            }
        }

        await _context.SaveChangesAsync(ct);

        var data = new AddQuestionResponse(questionDb.Id.ToString());

        await SendOkAsync(Result<AddQuestionResponse>.Success(data), ct);
    }
}
