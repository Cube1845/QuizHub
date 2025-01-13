using Microsoft.AspNetCore.Http;
using QuizHub.Domain.Entities;

namespace QuizHub.Application.Common.Interfaces;

public interface IImageService
{
    Task<Image?> GetImageByIdAsync(Guid imageId, CancellationToken ct = default);
    Task<Guid> AddImageAndGetIdWithoutSavingAsync(IFormFile image, CancellationToken ct = default);
    Task RemoveImageWithoutSavingAsync(Guid imageId, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
