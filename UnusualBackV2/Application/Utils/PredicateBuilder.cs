using System.Linq.Expressions;
using Domain.Entities.ExchangeData;
using Domain.Entities.Filtering;

namespace Application.Utils;

public static class PredicateBuilder
{
    public static Expression<Func<TradeStats, bool>> Build(Filter filter)
    {
        var param = Expression.Parameter(typeof(TradeStats), "x");
        var propName = TransformName(filter.Description.Name);
        var prop = Expression.PropertyOrField(param, propName);

        Expression left;

        if (prop.Type == typeof(DateTime))
        {
            var epoch = Expression.Constant(new DateTime(1970, 1, 1), typeof(DateTime));
            var delta = Expression.Subtract(Expression.Convert(prop, typeof(DateTime)), epoch);
            left = Expression.Property(delta, nameof(TimeSpan.TotalSeconds));
        }
        else if (prop.Type == typeof(TimeSpan))
        {
            left = Expression.Property(prop, nameof(TimeSpan.TotalSeconds));
        }
        else
        {
            left = Expression.Convert(prop, typeof(double));
        }

        var right = Expression.Constant(filter.Value, typeof(double));

        Expression body = filter.Condition switch
        {
            FilterCondition.Equals => Expression.Equal(left, right),
            FilterCondition.NotEquals => Expression.NotEqual(left, right),
            FilterCondition.Less => Expression.LessThan(left, right),
            FilterCondition.Greater => Expression.GreaterThan(left, right),
            FilterCondition.LessOrEquals => Expression.LessThanOrEqual(left, right),
            FilterCondition.GreaterOrEquals => Expression.GreaterThanOrEqual(left, right),
            _ => Expression.Constant(true)
        };

        return Expression.Lambda<Func<TradeStats, bool>>(body, param);
    }

    private static string TransformName(string name) =>
        string.Join(string.Empty, name.Split("_").Select(x => char.ToUpper(x[0]) + x[1..]));
}