using Domain.Entities.Filtering;

namespace WebApi.Dtos.Filtering;

public class FilteringRequestDto : FilterMessage
{
    public int? PresetId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}