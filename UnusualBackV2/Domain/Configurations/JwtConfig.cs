namespace Domain.Configurations;

public class JwtConfig
{
    public string Audience { get; init; } = string.Empty;
    public string Issuer { get; init; } = string.Empty;
    public string Secret { get; init; } = string.Empty;
    public int TokenValidityInSeconds { get; init; }
    public int RefreshTokenValidityInDays { get; init; }
}