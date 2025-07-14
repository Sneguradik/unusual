using Domain.Entities.Filtering;
using Domain.Interfaces.Repos;
using Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services.Repo;

public class CurrencyRepo(MainDbContext context) : ICurrencyRepo
{
    public async Task<IEnumerable<Currency>> GetAllCurrenciesAsync(int take, int skip, CancellationToken cancellationToken = default) => await context
        .Currencies
        .Skip(skip)
        .Take(take)
        .AsNoTracking()
        .ToArrayAsync(cancellationToken);

    public async Task<IEnumerable<Currency>> GetAllCurrenciesAsync(CancellationToken cancellationToken = default) => await context
        .Currencies
        .AsNoTracking()
        .ToArrayAsync(cancellationToken);
    
    public async Task<Currency?> GetCurrencyAsync(int id, CancellationToken cancellationToken = default) => await context
        .Currencies.FirstOrDefaultAsync(x=>x.Id == id, cancellationToken:cancellationToken);

    public async Task<Currency> AddCurrencyAsync(Currency newCurrency, CancellationToken cancellationToken = default)
    {
        var result = await context.Currencies.AddAsync(newCurrency, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return result.Entity;
    }

    public async Task UpdateCurrencyAsync(Currency updatedCurrency, CancellationToken cancellationToken = default)
    {
        var entity = await GetCurrencyAsync(updatedCurrency.Id,  cancellationToken);
        if (entity == null) return;
        entity.Name = updatedCurrency.Name;
        entity.Symbol = updatedCurrency.Symbol;
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteCurrencyAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default)
    {
        var result = await context.Currencies
            .Where(x=>ids.Contains(x.Id))
            .ExecuteDeleteAsync(cancellationToken);
        return result != 0;
    }

    public async Task<IEnumerable<Currency>> SearchCurrenciesAsync(string query, CancellationToken cancellationToken = default)
    {
        query = query.ToLower();
        return await context.Currencies.AsNoTracking()
            .Where(c => c.Name.ToLower().Contains(query) || c.Symbol.ToLower().Contains(query))
            .ToArrayAsync(cancellationToken);
    }
}