using Domain.Entities.ExchangeData;
using Domain.Entities.Filtering;

namespace Domain.Interfaces.Filtering;

public interface IFilterApplyingService
{
    Task<IEnumerable<TradeStatsAnalyzed>> ApplyFilters(IQueryable<TradeStats> trades, IEnumerable<Filter> filters, CancellationToken token = default);
}