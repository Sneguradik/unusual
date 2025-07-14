using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Domain.Entities.Auth;

namespace WebApi.Utils;

public static class IdentityUtils
{
    public static int? GetUserId(this HttpContext context)
    {
        var raw = context.User?.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(raw, out var userId))return userId;
        return null;
    }

    public static bool IsAdmin(this HttpContext context)
    {
        var raw = context.User?.Claims.FirstOrDefault(x => x.Type == "role")?.Value;
        return raw is not null && raw.Contains(RoleConst.Admin);
    }
}