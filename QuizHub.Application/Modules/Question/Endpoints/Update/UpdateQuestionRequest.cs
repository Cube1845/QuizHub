using QuizHub.Application.Modules.Question.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Update;

public record UpdateQuestionRequest(Guid QuestionBaseId, IdentifiedQuestionUpdateDTO Question);
