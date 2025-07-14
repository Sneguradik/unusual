using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Domain.Entities.Auth;
using Domain.Entities.Filtering;
using Infrastructure.DbContext;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using WebApi.Dtos.Auth;
using WebApi.Dtos.Filtering;
using WebApi.ExceptionHandling;

namespace WebApi.DI;

public static class WebDIExtensions 
{
    public static IServiceCollection AddExceptionHandling(this IServiceCollection services)
    {
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();
        return services;
    }
    public static IServiceCollection AddDiIdentity(this IServiceCollection services)
    {
        services.AddIdentityCore<User>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 8;
                options.Password.RequiredUniqueChars = 1;
                options.ClaimsIdentity.RoleClaimType = "role";
                options.ClaimsIdentity.UserNameClaimType = JwtRegisteredClaimNames.Name;
                options.ClaimsIdentity.UserIdClaimType = JwtRegisteredClaimNames.Sub;
            })
            .AddRoles<IdentityRole<int>>()
            .AddEntityFrameworkStores<MainDbContext>()
            .AddUserManager<UserManager<User>>()
            .AddRoleManager<RoleManager<IdentityRole<int>>>();
        return services;
    }

    public static IServiceCollection AddDiAuthorization(this IServiceCollection services)
    {
        services.AddAuthorization(options => options.DefaultPolicy =
            new AuthorizationPolicyBuilder
                    (JwtBearerDefaults.AuthenticationScheme)
                .RequireAuthenticatedUser()
                .Build());
        return services;
    }

    public static IServiceCollection AddDiAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication(opt => {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.MapInboundClaims = false;
        
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = configuration["Jwt:Issuer"]!,
                    ValidAudience = configuration["Jwt:Audience"]!,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Secret"]!)),
                    RoleClaimType = "role"
                };
            });
        return services;
    }

    public static IServiceCollection AddCors(this IServiceCollection services, string[] origins)
    {
        services.AddCors(opts=>opts.AddDefaultPolicy(policy=>policy
            .WithOrigins(origins)
            .AllowAnyHeader()
            .AllowCredentials()
            .AllowAnyMethod()
            .SetPreflightMaxAge(TimeSpan.FromMinutes(10))));
        return services;
    }
    
    public static WebApplication AddDiScalar(this WebApplication app)
    {
        app.MapScalarApiReference(options =>
        {
            options.WithTheme(ScalarTheme.Mars)
                .WithDarkMode(true)
                .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient)
                .WithDarkModeToggle(false)
                .AddPreferredSecuritySchemes(JwtBearerDefaults.AuthenticationScheme)
                .AddHttpAuthentication(JwtBearerDefaults.AuthenticationScheme, auth =>
                {
                    auth.Token = string.Empty;
                });
        });
        return app;
    }

    public static async Task AddAdmin(IServiceProvider serviceProvider)
    {
        var config = serviceProvider.GetRequiredService<IConfiguration>();
        var adminSettings = config.GetSection("Admin").Get<CreateUserDto>();

        if (adminSettings is null) return;  
        
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
        
        var adminRole = await roleManager.FindByNameAsync(RoleConst.Admin);
        if (adminRole is null) await roleManager.CreateAsync(new IdentityRole<int>(RoleConst.Admin));
    
        var userRole = await roleManager.FindByNameAsync(RoleConst.User);
        if (userRole is null) await roleManager.CreateAsync(new IdentityRole<int>(RoleConst.User));

        var superUser = await userManager.FindByNameAsync(adminSettings.Username);
        if (superUser is not null) return;
        
        await userManager.CreateAsync(new User{UserName = adminSettings.Username, Email = adminSettings.Email});
        superUser = await userManager.FindByNameAsync(adminSettings.Username);
        if (superUser is null) throw new Exception($"{adminSettings.Username} is null");
            
        await userManager.AddPasswordAsync(superUser, adminSettings.Password);
        await userManager.AddToRoleAsync(superUser, RoleConst.Admin);
    }

    public static async Task AddDescriptions(IServiceProvider serviceProvider)
    {
        var config = serviceProvider.GetRequiredService<IConfiguration>();
        var context = serviceProvider.GetRequiredService<MainDbContext>();

        var configuredDescriptions = config.GetSection("FilterDescriptions")
            .Get<List<CreateDescriptionDto>>() ?? [];

        foreach (var dto in configuredDescriptions)
        {
            var exists = await context.FilterDescriptions.AnyAsync(d => d.Name == dto.Name);
            if (exists) continue;

            context.FilterDescriptions.Add(new FilterDescription
            {
                Name = dto.Name,
                Description = dto.Description
            });
        }

        await context.SaveChangesAsync();
    }

    public static async Task<WebApplication> AddStartup(this WebApplication app)
    {
        app.MapOpenApi();
        app.UseCors();
        app.UseHttpsRedirection();

        app.UseAuthorization();
        app.UseExceptionHandler();
        app.MapControllers();

        app.AddDiScalar();

        using var scope = app.Services.CreateScope();
        var mainDbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
        await mainDbContext.Database.MigrateAsync();

        await AddAdmin(scope.ServiceProvider);
        await AddDescriptions(scope.ServiceProvider);

        return app;
    }
}