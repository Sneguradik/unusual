using Domain.Entities.Auth;
using Domain.Entities.Filtering;
using Domain.Interfaces.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using WebApi.Dtos.Filtering;
using WebApi.Utils;

namespace WebApi.Controllers
{
    [Route("preset")]
    [ApiController]
    public class PresetController(IPresetRepo presetRepo,  ICurrencyRepo currencyRepo) : ControllerBase
    {
        [HttpGet("public")]
        public async Task<IEnumerable<PresetDto>> GetPublicPresets([FromQuery] BatchQuery query,
            CancellationToken cancellationToken)
        {
            var presets = query.Take == 0? await presetRepo.GetAllPresetsAsync(true, cancellationToken) :
                    await presetRepo.GetAllPresetsAsync(query.Take, query.Skip, true, cancellationToken);
            
            return presets.Select(x => new PresetDto(x)).ToArray();
        }
            
        
        [Authorize(Roles = RoleConst.Admin)]
        [HttpGet("all")]
        public async Task<IEnumerable<PresetDto>> GetPrivatePresets(CancellationToken cancellationToken)
        {
           return (await presetRepo.GetAllPresetsAsync(false, cancellationToken))
                .Select(x => new PresetDto(x)).ToArray();
           
        }
            

        [Authorize]
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<PresetDto>>> GetMyPresets(CancellationToken cancellationToken)
        {
            var userId = HttpContext.GetUserId();
            if (userId is null) return Problem("Unauthorized", 
                statusCode: StatusCodes.Status401Unauthorized, 
                title:"Unauthorized");
            var user = new User { Id = (int)userId };
            return (await presetRepo.GetPresetsByUserAsync(user, false, cancellationToken))
                .Select(x => new PresetDto(x))
                .ToArray();
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(EditPresetDto dto,CancellationToken cancellationToken)
        {
            var userId = HttpContext.GetUserId();
            if (userId is null) return Problem("Unauthorized", 
                statusCode: StatusCodes.Status401Unauthorized, 
                title:"Unauthorized");
            
            var preset = new Preset
            {
                Owner = new User { Id = (int)userId },
                Currency = new Currency() {Id = dto.CurrencyId},
                ExcludedCodes = dto.ExcludedCodes,
                Name = dto.Name,
                IsPublic = dto.IsPublic,
                IsDefault = false,
                Filters = dto.Filters.Select(f => new Filter
                {
                    Description = new (){Id = f.DescriptionId},
                    Value = f.Value,
                    Active = f.Active,
                    Type = f.Type,
                    UseTrigger = f.UseTrigger,
                    Condition = f.Condition,
                    
                }).ToList(),
            };
            
            await presetRepo.AddPresetAsync(preset, cancellationToken);
            return Ok();
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<PresetDto>> GetPreset(int id, CancellationToken cancellationToken)
        {
            var userId = HttpContext.GetUserId();
            var preset = await presetRepo.GetPresetAsync(id, cancellationToken);
            if (preset is null) return 
                Problem("Preset with given id not found", statusCode: StatusCodes.Status404NotFound, title:"Not Found");

            if (!HttpContext.IsAdmin() && preset.Owner.Id != userId) return 
                Problem("You have no permission to update this preset", statusCode: StatusCodes.Status403Forbidden, title:"Forbidden");
            return new PresetDto(preset);
        }
        
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id,[FromBody] EditPresetDto dto, CancellationToken cancellationToken)
        {
            var userId = HttpContext.GetUserId();

            var preset = await presetRepo.GetPresetAsync(id, cancellationToken);
            if (preset is null)
                return Problem("Preset with given id not found", statusCode: StatusCodes.Status404NotFound, title: "Not Found");

            if (!HttpContext.IsAdmin() && preset.Owner.Id != userId)
                return Problem("You have no permission to update this preset", statusCode: StatusCodes.Status403Forbidden, title: "Forbidden");

            preset.Name = dto.Name;
            preset.IsPublic = dto.IsPublic;
            preset.ExcludedCodes = dto.ExcludedCodes;
            
            if(HttpContext.IsAdmin()) preset.IsDefault = dto.IsDefault;
            
            if (preset.Currency.Id != dto.CurrencyId)
            {
                var currency = await currencyRepo.GetCurrencyAsync(dto.CurrencyId, cancellationToken);
                if (currency == null) return Problem("Currency not found", statusCode: 404);
                preset.Currency = currency;
            }
            var filters = dto.Filters.Select(dtoFilter =>
            
                new Filter
                {
                    Description = new (){Id = dtoFilter.DescriptionId},
                    Value = dtoFilter.Value,
                    Condition = dtoFilter.Condition,
                    Type = dtoFilter.Type,
                    Active = dtoFilter.Active,
                    UseTrigger = dtoFilter.UseTrigger
                }
            ).ToList();

                foreach (var filter in filters)
            {
                var presetFilter = preset.Filters.FirstOrDefault(x => x.Description.Id == filter.Description.Id);
                if (presetFilter is null) continue;
                presetFilter.Value = filter.Value;
                presetFilter.Condition = filter.Condition;
                presetFilter.Type = filter.Type;
                presetFilter.Active = filter.Active;
                presetFilter.UseTrigger = filter.UseTrigger;
            }

            await presetRepo.UpdatePresetAsync(preset, cancellationToken);
            return Ok();
        }

        [Authorize(Roles = RoleConst.Admin)]
        [HttpDelete]
        public async Task<IActionResult> Delete(DeletePresetDto dto, CancellationToken cancellationToken)
        {
            await presetRepo.DeletePresetAsync(dto.Ids,  cancellationToken);
            return Ok();
        }
    }
}
