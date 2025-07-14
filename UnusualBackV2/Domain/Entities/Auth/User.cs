using Microsoft.AspNetCore.Identity;

namespace Domain.Entities.Auth;

public class User : IdentityUser<int>
{
    public RefreshToken? RefreshToken { get; set; }
}