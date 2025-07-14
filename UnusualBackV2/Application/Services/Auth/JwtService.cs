
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Domain.Configurations;
using Domain.Entities.Auth;
using Domain.Interfaces.Auth;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Application.Services.Auth;

public class JwtService(IOptions<JwtConfig> config) : IJwtService
{
    private readonly JwtConfig _jwtConfig = config.Value;
    
    private static IEnumerable<Claim> CreateClaims(User user, string[] roles)
    {
        var iat = DateTimeOffset.UtcNow;
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new (JwtRegisteredClaimNames.Name, user.UserName!),
            new (JwtRegisteredClaimNames.Email, user.Email!),
            new (JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        };
        claims.AddRange(roles.Select(role => new Claim("role", role)));
        return claims;
    }

    public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Secret)),
            ValidateLifetime = false
        };

        var tokenHandler = new JwtSecurityTokenHandler()
        {
            MapInboundClaims = false
        };
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
        if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            throw new SecurityTokenException("Invalid token");

        return principal;
    }

    private SigningCredentials CreateSigningCredentials()
    {
        return new SigningCredentials(
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_jwtConfig.Secret)
            ),
            SecurityAlgorithms.HmacSha256
        );
    }

    public string GenerateToken(User user, string[] roles)
    {
        var token =  new JwtSecurityToken(
            _jwtConfig.Issuer,
            _jwtConfig.Audience,
            CreateClaims(user,roles),
            expires: DateTime.UtcNow.AddSeconds(_jwtConfig.TokenValidityInSeconds),
            signingCredentials: CreateSigningCredentials()
        );
        var handler = new JwtSecurityTokenHandler();

        return handler.WriteToken(token);
    }

    public string GenerateToken(IEnumerable<Claim> claims)
    {
        if (claims is null) throw new Exception("Token is incorrect");
        var token = new JwtSecurityToken(
            issuer: _jwtConfig.Issuer,
            audience: _jwtConfig.Audience,
            expires: DateTime.UtcNow.AddSeconds(_jwtConfig.TokenValidityInSeconds),
            claims: claims,
            signingCredentials: CreateSigningCredentials()
        );

        var handler = new JwtSecurityTokenHandler();

        return handler.WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
    
}