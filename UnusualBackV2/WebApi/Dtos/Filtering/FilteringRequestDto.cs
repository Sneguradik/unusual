using Domain.Entities.Filtering;

namespace WebApi.Dtos.Filtering;

public class FilteringRequestDto
{
    public int? PresetId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    public Currency Currency { get; set; } = new();
    public string ExcludedCodes { get; set; } = string.Empty;
    public ICollection<FilterDto> Filters { get; set; } = new List<FilterDto>();
}