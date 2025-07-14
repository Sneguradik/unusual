using Domain.Entities.Filtering;

namespace Domain.Interfaces.Repos;

public interface IFilterDescriptionRepo
{
    Task<IEnumerable<FilterDescription>> GetAllFilterDescriptionsAsync(int take, int skip, CancellationToken cancellationToken = default);
    Task<IEnumerable<FilterDescription>> GetAllFilterDescriptionsAsync(CancellationToken cancellationToken = default);
    Task<FilterDescription?> GetFilterDescriptionByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<FilterDescription> AddFilterDescriptionAsync(FilterDescription description, CancellationToken cancellationToken = default);
    Task UpdateFilterDescriptionAsync(FilterDescription description, CancellationToken cancellationToken = default);
    Task<bool> DeleteFilterDescriptionAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default);
    
}