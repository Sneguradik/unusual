using Domain.Interfaces.Repos;
using Infrastructure.DbContext;
using Infrastructure.Services.Repo;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.DI;

public static class ApplicationDIExtensions
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddScoped<ICurrencyRepo, CurrencyRepo>();
        services.AddScoped<IHistoricTradesRepo, HistoricTradeRepo>();
        services.AddScoped<ITradeRepo, TradeRepo>();
        services.AddScoped<IFilterDescriptionRepo, FilterDescriptionRepo>();
        services.AddScoped<IPresetRepo, PresetRepo>();
        services.AddScoped<IFiltersRepo, FilterRepo>();
        return services;
    }
    public static IServiceCollection AddDataBases(this IServiceCollection services, 
        string? spbeConnectionString, string? mainDbConnectionString)
    {
        services.AddDbContext<MainDbContext>(opt=>
            opt.UseNpgsql(mainDbConnectionString));
        
        services.AddDbContext<TradeDbContext>(opt=>
            opt
                .UseNpgsql(spbeConnectionString)
                .UseSnakeCaseNamingConvention());
        return services;
    }
}