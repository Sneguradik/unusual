using Domain.Dto;
using Domain.Entities.ExchangeData;
using Domain.Entities.Filtering;

namespace Domain.Interfaces.Repos;

public interface IHistoricTradesRepo
{
    Task<IEnumerable<TradeStatsAnalyzed>> GetAllAsync(int take, int skip ,CancellationToken cancellationToken = default);
    Task<int> CountAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<TradeStatsAnalyzed>> GetByDateAsync(DateTime start, DateTime finish ,CancellationToken cancellationToken = default);
    Task<IEnumerable<TradeStatsAnalyzed>> GetByCurrencyAsync(Currency currency, CancellationToken cancellationToken = default);
    Task<IEnumerable<TradeStatsAnalyzed>> GetByCurrencyAsync(Currency currency, int take, int skip, CancellationToken cancellationToken = default);
    Task<IEnumerable<TradeStatsAnalyzed>> GetByCurrencyAsync(Currency currency, DateTime start, DateTime finish, CancellationToken cancellationToken = default);
    Task<IEnumerable<TradeStatsAnalyzed>> GetByCurrencyAsync(Currency currency, DateTime start, DateTime finish, int take, int skip, CancellationToken cancellationToken = default);
    Task<int> CountByCurrencyAsync(Currency currency, CancellationToken cancellationToken = default);

    Task AddStatsAsync(IEnumerable<TradeStatsAnalyzed> stats, CancellationToken cancellationToken = default);
    
    Task<List<DealsStatsByCurrencyDto>> CountRecentTradesByCurrencyAsync(DateTime fromDate, CancellationToken cancellationToken = default);
    
    Task<IEnumerable<TradeStatsAnalyzed>> GetDefaultTradesByCurrencyAsync(Currency currency, int take = 200, CancellationToken cancellationToken = default);
}