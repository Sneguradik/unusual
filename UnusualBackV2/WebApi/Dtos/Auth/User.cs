namespace WebApi.Dtos.Auth;

public record UserDto(int Id, string Username, string Email, string  Role);
public record ChangePasswordDto(string OldPassword, string NewPassword);
public record ChangeUserDto(string NewName, string NewEmail);
public record CreateUserDto(string Username, string Email, string Password);

public record ChangeRoleDto(string Role);
