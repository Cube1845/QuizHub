using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Interfaces;

namespace QuizHub.Application.Modules.Image.Endpoints.Get;

public class GetImageEndpoint(IAppDbContext context) : Endpoint<GetImageRequest>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("image/{ImageId}");
    }

    public override async Task HandleAsync(GetImageRequest req, CancellationToken ct)
    {
        var image = await _context.Images.FindAsync([req.ImageId], ct);

        if (image == null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        await SendBytesAsync(image.Data, image.ContentType, cancellation: ct);
    }
}
