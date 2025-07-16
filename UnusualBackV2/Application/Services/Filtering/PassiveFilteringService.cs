using Domain.Entities.ExchangeData;
using Domain.Entities.Filtering;
using Domain.Interfaces.Filtering;
using Domain.Interfaces.Repos;
using Microsoft.Extensions.Logging;

namespace Application.Services.Filtering;

public class PassiveFilteringService(IFilterApplyingService filterService, IHistoricTradesRepo historicTrades, ICurrencyRepo currencyRepo, IPresetRepo presetRepo, ITradeRepo tradeRepository, ILogger<PassiveFilteringService> logger) : IPassiveFilteringService
{
    public async Task RunAsync(CancellationToken cancellationToken = default)
    {
        var currencies = await currencyRepo.GetAllCurrenciesAsync(cancellationToken);
        var semaphore = new SemaphoreSlim(4);

        var tasks = currencies.Select(async currency =>
        {
            await semaphore.WaitAsync(cancellationToken);
            try
            {
                var filtered = await FilterByCurrencyAsync(currency, cancellationToken);
                if (filtered.Any())
                {
                    await historicTrades.AddStatsAsync(filtered, cancellationToken);
                    logger.LogInformation("Saved {Count} trades for {Currency}", filtered.Count(), currency.Symbol);
                }
                else logger.LogInformation("No new trades for {Currency}", currency.Symbol);
                
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error filtering trades for {Currency}", currency.Symbol);
            }
            finally
            {
                semaphore.Release();
            }
        });

        await Task.WhenAll(tasks);
    }

    private async Task<IEnumerable<TradeStatsAnalyzed>> FilterByCurrencyAsync(Currency currency,
        CancellationToken cancellationToken = default)
    {
        var defaultPreset = await presetRepo.GetDefaultPresetAsync(currency, cancellationToken);
        if (defaultPreset?.Preset is null || defaultPreset.Currency is null)
        {
            logger.LogInformation("No default preset for currency {Currency}", currency.Symbol);
            return [];
        }

        var lastDeal = (await historicTrades.GetByCurrencyAsync(currency, 2, 0, cancellationToken))
            .FirstOrDefault();
        DateTime syncPoint;
        
        if (lastDeal is null) syncPoint = DateTime.UtcNow - TimeSpan.FromDays(1);
        else syncPoint = lastDeal.TradeDate ;
        var filterMessage = new FilterMessage
        {
            Currency = defaultPreset.Currency,
            ExcludedCodes = defaultPreset.Preset.ExcludedCodes,
            Filters = defaultPreset.Preset.Filters,
        };
        
        return await filterService.ApplyFilters(
            tradeRepository.GetTradeResults(filterMessage,syncPoint, DateTime.UtcNow),
            defaultPreset.Preset.Filters,
            token: cancellationToken);
    }
}