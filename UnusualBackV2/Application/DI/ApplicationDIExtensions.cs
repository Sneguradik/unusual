using Application.Services.Auth;
using Application.Services.Filtering;
using Domain.Interfaces.Auth;
using Domain.Interfaces.Filtering;
using Domain.Interfaces.Repos;
using Infrastructure.DbContext;
using Infrastructure.Services.Repo;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Application.DI;


public static class ApplicationDIExtensions
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<ITradeRepo, TradeRepo>();
        services.AddScoped<IFilterApplyingService, FilterApplyingService>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IPassiveFilteringService, PassiveFilteringService>();
        return services;
    }
    
}