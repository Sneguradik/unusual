namespace Domain.Entities.Filtering;

public class FilterMessage
{
    public Currency Currency { get; set; } = new();
    public string ExcludedCodes { get; set; } = string.Empty;
    public ICollection<Filter> Filters { get; set; } = new List<Filter>();
}