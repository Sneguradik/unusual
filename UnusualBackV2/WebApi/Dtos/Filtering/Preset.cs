using Domain.Entities.Filtering;
using WebApi.Dtos.Auth;

namespace WebApi.Dtos.Filtering;

public class PresetDto 
{
    public int Id { get; set; }
    public string Name { get; set; } 
    public UserDto Owner { get; set; } =  null!;
    public bool IsDefault { get; set; }
    public bool IsPublic { get; set; }
    
    public Currency Currency { get; set; }
    public string ExcludedCodes { get; set; } 
    public List<FilterDto>  Filters { get; set; } 

    public PresetDto(Preset preset)
    {
        Id = preset.Id;
        Name = preset.Name;
        IsDefault = preset.IsDefault;
        IsPublic = preset.IsPublic;
        Currency = preset.Currency;
        ExcludedCodes = preset.ExcludedCodes;
        Filters = preset.Filters.Select(f => new FilterDto
        {
            Description = f.Description, 
            Active = f.Active, 
            Condition = f.Condition, 
            Type = f.Type, 
            UseTrigger = f.UseTrigger, 
            Value = f.Value
        }).ToList();
        Owner = new UserDto(preset.Owner.Id, preset.Owner.UserName, preset.Owner.Email, "");
    }
}

public class EditPresetDto
{
    public int CurrencyId { get; set; }
    public string ExcludedCodes { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public bool IsPublic { get; set; }
    public bool IsDefault { get; set; }
    public List<EditFilterDto> Filters { get; set; } = new();
}

public record DeletePresetDto(List<int> Ids);


