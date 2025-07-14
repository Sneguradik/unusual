using Domain.Entities.ExchangeData;

namespace Domain.Interfaces.Filtering;

public interface IPassiveFilteringService
{
    Task RunAsync(CancellationToken cancellationToken = default);
}