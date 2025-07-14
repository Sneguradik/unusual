using Domain.Entities.Filtering;

namespace WebApi.Dtos.Filtering;

public class FilterDto : FilterValue
{
    public FilterDescription Description { get; set; } = new();
};

public class EditFilterDto : FilterValue
{
    public int DescriptionId { get; set; }
};

public record CreateDescriptionDto(string Name, string Description);