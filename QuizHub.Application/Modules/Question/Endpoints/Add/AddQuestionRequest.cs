using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Add;

public record AddQuestionRequest(string QuestionBaseId, UnidentifiedQuestion Question);
