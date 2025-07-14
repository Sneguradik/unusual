using Application.DI;
using Domain.Configurations;
using Infrastructure.DI;
using WebApi.DI;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(builder.Configuration.GetSection("TrustedOrigins").Get<string[]>()!);
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services
    .AddExceptionHandling()
    .AddDataBases(builder.Configuration.GetConnectionString("SPBE"),
        builder.Configuration.GetConnectionString("MainDb"))
    .AddDiAuthentication(builder.Configuration)
    .AddDiAuthorization()
    .AddDiIdentity()
    .AddInfrastructureServices()
    .AddServices();
builder.Services.Configure<JwtConfig>(builder.Configuration.GetSection("JWT"));

var app = builder.Build();

await app.AddStartup();

app.Run();