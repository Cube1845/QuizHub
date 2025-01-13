using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Domain.Entities;

namespace QuizHub.Infrastructure.Data;

public class ImageService(AppDbContext context) : IImageService
{
    private readonly AppDbContext _context = context;

    public async Task<Image?> GetImageByIdAsync(Guid imageId, CancellationToken ct = default)
    {
        return await _context.Images.FindAsync(imageId, ct);
    }

    public async Task<Guid> AddImageAndGetIdWithoutSavingAsync(IFormFile image, CancellationToken ct = default)
    {
        var imageDb = await image.ToImageDbAsync(ct);
        await _context.Images.AddAsync(imageDb, ct);

        return imageDb.Id;
    }

    public async Task RemoveImageWithoutSavingAsync(Guid imageId, CancellationToken ct = default)
    {
        await _context.Images
            .Where(image => image.Id == imageId)
            .ExecuteDeleteAsync(ct);
    }

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _context.SaveChangesAsync(ct);
    }
}
