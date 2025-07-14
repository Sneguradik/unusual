namespace WebApi.Dtos.Auth;

public record LoginDto(string Email, string Password);

public record RegisterDto(string UserName, string Email, string Password);

public record TokenPair(string Token, string RefreshToken);

public record AuthDto(int Id, string Username, string Email, string Role,TokenPair TokenPair) : 
    UserDto(Id, Username, Email,  Role);

public record RefreshDto(string RefreshToken);

