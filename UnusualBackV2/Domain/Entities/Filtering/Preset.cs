using System.ComponentModel.DataAnnotations;
using Domain.Entities.Auth;

namespace Domain.Entities.Filtering;

public class Preset : FilterMessage
{
    [Key]
    public int Id { get; set; }
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;
    public User Owner  { get; set; } = new();
    public bool IsDefault { get; set; }
    public bool IsPublic { get; set; }
}