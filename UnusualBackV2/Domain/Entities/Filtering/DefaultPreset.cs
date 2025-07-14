using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Domain.Entities.Filtering;

public class DefaultPreset
{
    [Key]
    public int Id { get; set; }
    [JsonIgnore]
    public int? CurrencyId { get; set; }
    public Currency? Currency { get; set; } = new ();
    [JsonIgnore]
    public int? PresetId { get; set; }
    public Preset? Preset { get; set; } = new ();
}