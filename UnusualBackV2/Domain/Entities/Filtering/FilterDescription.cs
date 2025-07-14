using System.ComponentModel.DataAnnotations;

namespace Domain.Entities.Filtering;

public class FilterDescription
{
    [Key]
    public int Id { get; set; }
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } =  string.Empty;
}