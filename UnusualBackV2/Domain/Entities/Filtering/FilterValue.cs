using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Filtering;

[NotMapped]
public class FilterValue
{
    public FilterCondition Condition { get; set; }
    public double Value { get; set; }
    public FilterType Type { get; set; }
    public bool UseTrigger  { get; set; } = true;
    public bool Active { get; set; } = true;
}

public enum FilterCondition
{
    Equals,
    Less,
    Greater,
    LessOrEquals,
    GreaterOrEquals,
    NotEquals,
}

public enum FilterType
{
    And,
    Or
}
