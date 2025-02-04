using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Modules.Client.Endpoints.Begin;

public class BeginTestEndpoint(IAppDbContext context) : Endpoint<BeginTestRequest, Result<BeginTestResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Post("client/test");
        AllowAnonymous();
    }

    public override async Task HandleAsync(BeginTestRequest req, CancellationToken ct)
    {
        
    }
}
