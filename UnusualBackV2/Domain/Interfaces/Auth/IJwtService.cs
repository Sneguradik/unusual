using System.Security.Claims;
using Domain.Entities.Auth;

namespace Domain.Interfaces.Auth;

public interface IJwtService
{
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    string GenerateToken(User user, string[] roles);
    string GenerateToken(IEnumerable<Claim> claims);
    string GenerateRefreshToken();
}