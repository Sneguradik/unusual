using Domain.Entities.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Dtos.Auth;
using WebApi.Utils;

namespace WebApi.Controllers
{
    [Route("users")]
    [ApiController]
    public class UserController(UserManager<User> userManager) : ControllerBase
    {
        [Authorize(Roles = RoleConst.Admin)]
        [HttpGet("all")]
        public async Task<IEnumerable<UserDto>> GetAll(CancellationToken cancellationToken) =>
            await userManager.Users
                .Select(u => new UserDto(u.Id, u.UserName!, u.Email!, ""))
                .ToArrayAsync(cancellationToken);

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> Get(int id,CancellationToken cancellationToken)
        {
            var userId = HttpContext.GetUserId();
            
            
            if (userId is null) return Problem("Unauthorized", 
                statusCode: StatusCodes.Status401Unauthorized, 
                title:"Unauthorized");
            
            if(!HttpContext.IsAdmin() && userId!=id) 
                return Problem("You have no permission to update this preset", statusCode: StatusCodes.Status403Forbidden, title:"Forbidden");
            
            var user = await userManager.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
            if (user is null) return Problem("User not found", statusCode: StatusCodes.Status404NotFound, title:"Not Found");
            var roles = await userManager.GetRolesAsync(user);
            return new UserDto(user.Id, user.UserName!, user.Email!, roles[0]);
        }

        [Authorize(Roles = RoleConst.Admin)]
        [HttpPost("create")]
        public async Task<IActionResult> Create(CreateUserDto dto, CancellationToken cancellationToken)
        {
           
            var user = new User{UserName = dto.Username, Email = dto.Email};
            var result = await userManager.CreateAsync(user, dto.Password);
            await userManager.AddToRoleAsync(user, RoleConst.User);
            if (!result.Succeeded) return BadRequest(result.Errors);
            return Ok();
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ChangeUserDto dto, CancellationToken cancellationToken)
        {
            var userId = HttpContext.GetUserId();
            if (userId is null) return Problem("Unauthorized", 
                statusCode: StatusCodes.Status401Unauthorized, 
                title:"Unauthorized");
            
            if(!HttpContext.IsAdmin() && userId!=id) 
                return Problem("You have no permission to update this preset", statusCode: StatusCodes.Status403Forbidden, title:"Forbidden");
            
            var user = await userManager.FindByIdAsync(id.ToString());
            if(user is null) return Problem("User not found", statusCode: StatusCodes.Status404NotFound, title: "Not Found");
            
            if(user.Email != dto.NewEmail) user.Email = dto.NewEmail;
            if (user.UserName != dto.NewName)  user.UserName = dto.NewName;
            await userManager.UpdateAsync(user);
            return Ok();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var userId = HttpContext.GetUserId();
            if (userId is null) return Problem("Unauthorized", 
                statusCode: StatusCodes.Status401Unauthorized, 
                title:"Unauthorized");
            
            if(!HttpContext.IsAdmin() && userId!=id) 
                return Problem("You have no permission to update this preset", statusCode: StatusCodes.Status403Forbidden, title:"Forbidden");
            
            var user = await userManager.FindByIdAsync(id.ToString());
            if(user is null) return Problem("User not found", statusCode: StatusCodes.Status404NotFound, title: "Not Found");
            await userManager.DeleteAsync(user);
            
            return Ok();
        }

        [Authorize(Roles = RoleConst.Admin)]
        [HttpPost("set_role/{id}")]
        public async Task<IActionResult> SetAdmin(int id, [FromBody] ChangeRoleDto role, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByIdAsync(id.ToString());
            if(user is null) return Problem("User not found", statusCode: StatusCodes.Status404NotFound, title: "Not Found");
            var roles = await userManager.GetRolesAsync(user);
            await userManager.RemoveFromRolesAsync(user, roles);
            await userManager.AddToRoleAsync(user, role.Role);
            return Ok();
        }
    }
}
