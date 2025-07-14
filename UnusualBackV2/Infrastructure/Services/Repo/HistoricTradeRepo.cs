using Domain.Dto;
using Domain.Entities.ExchangeData;
using Domain.Entities.Filtering;
using Domain.Interfaces.Repos;
using Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services.Repo;

public class HistoricTradeRepo(MainDbContext context) : IHistoricTradesRepo
{
    public async Task<IEnumerable<TradeStatsAnalyzed>> GetAllAsync(int take, int skip, 
        CancellationToken cancellationToken = default) => await context
        .TradeStats
        .AsNoTracking()
        .OrderByDescending(x=>x.TradeDate)
        .Skip(skip)
        .OrderByDescending(x => x.TradeDate)
        .Take(take)
        .ToArrayAsync(cancellationToken);
    
    public async Task<int> CountAllAsync(CancellationToken cancellationToken = default) => 
        await context.TradeStats.CountAsync(cancellationToken);

    public async Task<IEnumerable<TradeStatsAnalyzed>> GetByDateAsync(DateTime start, DateTime finish, 
        CancellationToken cancellationToken = default) => await context
        .TradeStats
        .AsNoTracking()
        .OrderByDescending(x => x.TradeDate)
        .Where(x => x.TradeDate >= start && x.TradeDate <= finish)
        .OrderByDescending(x=>x.TradeDate)
        .ToArrayAsync(cancellationToken);
    
    public async Task<IEnumerable<TradeStatsAnalyzed>> GetByCurrencyAsync(Currency currency, 
        CancellationToken cancellationToken = default) => await context
        .TradeStats
        .AsNoTracking()
        .OrderByDescending(x => x.TradeDate)
        .Where(x=>x.Currency ==  currency.Symbol)
        .ToArrayAsync(cancellationToken);

    public async Task<IEnumerable<TradeStatsAnalyzed>> GetByCurrencyAsync(Currency currency, int take, int skip, 
        CancellationToken cancellationToken = default) => await context
        .TradeStats
        .AsNoTracking()
        .OrderByDescending(x => x.TradeDate)
        .Where(x=>x.Currency ==  currency.Symbol)
        .Skip(skip).Take(take)
        .ToArrayAsync(cancellationToken);

    public async Task<IEnumerable<TradeStatsAnalyzed>> GetByCurrencyAsync(Currency currency, DateTime start, DateTime finish,
        CancellationToken cancellationToken = default) => await context
        .TradeStats
        .AsNoTracking()
        .OrderByDescending(x => x.TradeDate)
        .Where(x => x.TradeDate >= start && x.TradeDate <= finish)
        .Where(x=>x.Currency ==  currency.Symbol)
        .ToArrayAsync(cancellationToken);
    
    public async Task<IEnumerable<TradeStatsAnalyzed>> GetByCurrencyAsync(Currency currency, DateTime start, DateTime finish, int take, int skip,
        CancellationToken cancellationToken = default) => await context
        .TradeStats
        .AsNoTracking()
        .OrderByDescending(x => x.TradeDate)
        .Where(x => x.TradeDate >= start && x.TradeDate <= finish)
        .Where(x=>x.Currency ==  currency.Symbol)
        .Skip(skip).Take(take)
        .ToArrayAsync(cancellationToken);

    public async Task<int> CountByCurrencyAsync(Currency currency, CancellationToken cancellationToken = default) => 
        await context.TradeStats.CountAsync(x => x.Currency ==  currency.Symbol, cancellationToken);

    public async Task AddStatsAsync(IEnumerable<TradeStatsAnalyzed> stats, CancellationToken cancellationToken = default)
    {
        await context.TradeStats.AddRangeAsync(stats, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<DealsStatsByCurrencyDto>> CountRecentTradesByCurrencyAsync(DateTime fromDate, CancellationToken cancellationToken = default)
    {
        var flatStats = await context.TradeStats
            .AsNoTracking()
            .Where(x => x.TradeDate >= fromDate)
            .GroupBy(x => new { Date = x.TradeDate.Date, x.Currency })
            .Select(g => new
            {
                Day = g.Key.Date,
                Currency = g.Key.Currency,
                Count = g.Count()
            })
            .ToListAsync(cancellationToken);
        
        var result = flatStats
            .GroupBy(x => x.Day)
            .Select(g => new DealsStatsByCurrencyDto(
                g.Key,
                g.ToDictionary(item => item.Currency, item => item.Count)
            ))
            .OrderBy(x => x.Day)
            .ToList();

        return result;
    }


    public async Task<IEnumerable<TradeStatsAnalyzed>> GetDefaultTradesByCurrencyAsync(Currency currency, int take = 200, CancellationToken cancellationToken = default)
    {
        return await context.TradeStats
            .AsNoTracking()
            .Where(x => x.Currency == currency.Symbol)
            .OrderByDescending(x => x.TradeDate)
            .Take(take)
            .ToListAsync(cancellationToken);
    }

}