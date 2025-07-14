using System.Linq.Expressions;
using Application.Utils;
using Domain.Entities.ExchangeData;
using Domain.Entities.Filtering;
using Domain.Interfaces.Filtering;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Filtering;

public class FilterApplyingService : IFilterApplyingService
{
    public async Task<IEnumerable<TradeStatsAnalyzed>> ApplyFilters(
        IQueryable<TradeStats> trades,
        IEnumerable<Filter> filters,
        CancellationToken token = default)
    {
        var active = filters.Where(f => f.Active).ToList();
        var andFilters = active.Where(f => f.Type == FilterType.And).ToList();
        var orFilters = active.Where(f => f.Type == FilterType.Or).ToList();

        var andTriggers = andFilters.Count(f => f.UseTrigger);


        var combined = andFilters
            .Select(PredicateBuilder.Build)
            .Aggregate<Expression<Func<TradeStats, bool>>?, Expression<Func<TradeStats, bool>>?>(null,
                (current, p) => current == null ? p : current.And(p));

        if (combined != null)
            trades = trades.Where(combined);

        var result = await trades
            .AsNoTracking()
            .Select(x => new TradeStatsAnalyzed(x) { TotalScore = andTriggers })
            .ToListAsync(token);


        foreach (var trade in from f in orFilters
                 from trade in result
                 where PredicateBuilder.Build(f).Compile()(trade)
                 select trade)
            trade.TotalScore++;

        return result;
    }
}