using System.ComponentModel.DataAnnotations;

namespace Domain.Entities.Filtering;

public class Filter : FilterValue
{
    [Key]
    public int Id { get; set; }
    public FilterDescription Description { get; set; } = new ();
    
    public int PresetId { get; set; }
    public Preset Preset { get; set; } = null!;
}