using Domain.Entities.Filtering;

namespace Domain.Interfaces.Repos;

public interface IFiltersRepo
{
    Task<IEnumerable<Filter>> GetFiltersByPresetIdAsync(int presetId, CancellationToken cancellationToken = default);
    Task AddFiltersAsync(IEnumerable<Filter> filters, CancellationToken cancellationToken = default);
    Task RemoveFiltersByPresetIdAsync(int presetId, CancellationToken cancellationToken = default);
    Task UpdateFiltersAsync(int presetId, IEnumerable<Filter> newFilters, CancellationToken cancellationToken = default);
}