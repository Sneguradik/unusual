using Domain.Entities.Filtering;
using Domain.Interfaces.Repos;
using Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services.Repo;

public class FilterDescriptionRepo(MainDbContext context) : IFilterDescriptionRepo
{
    public async Task<IEnumerable<FilterDescription>> GetAllFilterDescriptionsAsync(int take, int skip, CancellationToken cancellationToken = default) => await context
        .FilterDescriptions
        .Skip(skip)
        .Take(take)
        .AsNoTracking()
        .ToListAsync(cancellationToken);

    public async Task<IEnumerable<FilterDescription>> GetAllFilterDescriptionsAsync(CancellationToken cancellationToken = default) => await context
        .FilterDescriptions
        .AsNoTracking()
        .ToArrayAsync(cancellationToken);

    public async Task<FilterDescription?> GetFilterDescriptionByIdAsync(int id, CancellationToken cancellationToken = default) => await context
        .FilterDescriptions
        .FindAsync([id], cancellationToken);
    
    public async Task<FilterDescription> AddFilterDescriptionAsync(FilterDescription description, CancellationToken cancellationToken = default)
    {
        var result = await context.FilterDescriptions.AddAsync(description, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return result.Entity;
    }

    public async Task UpdateFilterDescriptionAsync(FilterDescription description, CancellationToken cancellationToken = default)
    {
        var entity = await GetFilterDescriptionByIdAsync(description.Id, cancellationToken);
        if (entity == null) return;
        entity.Description = description.Description;
        entity.Name = description.Name;
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteFilterDescriptionAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default)
    {
        var result = await context.FilterDescriptions.Where(x=>ids.Contains(x.Id)).ExecuteDeleteAsync(cancellationToken);
        return result != 0;
    }
}