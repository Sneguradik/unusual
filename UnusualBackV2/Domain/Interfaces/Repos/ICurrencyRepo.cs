using Domain.Entities.Filtering;

namespace Domain.Interfaces.Repos;

public interface ICurrencyRepo
{
    Task<IEnumerable<Currency>> GetAllCurrenciesAsync(int take, int skip, CancellationToken cancellationToken = default);
    Task<IEnumerable<Currency>> GetAllCurrenciesAsync(CancellationToken cancellationToken = default);
    Task<Currency?> GetCurrencyAsync(int id, CancellationToken cancellationToken = default);
    Task<Currency> AddCurrencyAsync(Currency newCurrency, CancellationToken cancellationToken = default);
    Task UpdateCurrencyAsync(Currency updatedCurrency, CancellationToken cancellationToken = default);
    Task<bool> DeleteCurrencyAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default);
    Task<IEnumerable<Currency>> SearchCurrenciesAsync(string query,CancellationToken cancellationToken = default);
}