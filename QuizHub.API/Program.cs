using FastEndpoints;
using FastEndpoints.Swagger;
using QuizHub.API;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddAppDI(builder.Configuration);

builder.Services.AddCors();

builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors(options => options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app
    .UseAuthentication()
    .UseAuthorization()
    .UseFastEndpoints(config =>
    {
        config.Endpoints.RoutePrefix = "api";
        config.Errors.ResponseBuilder = (failures, ctx, _) =>
        {
            ctx.Response.ContentType = "application/json";
            return ErrorResponseBuilder.Build(failures);
        };
    })
    .UseSwaggerGen();

app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
