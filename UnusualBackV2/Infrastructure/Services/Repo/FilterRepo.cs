using Domain.Entities.Filtering;
using Domain.Interfaces.Repos;
using Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services.Repo;

public class FilterRepo(MainDbContext context) : IFiltersRepo
{
    public async Task<IEnumerable<Filter>> GetFiltersByPresetIdAsync(int presetId, CancellationToken cancellationToken = default) => 
        await context.Filters
            .AsNoTracking()
            .AsSplitQuery()
            .Where(f => f.PresetId == presetId)
            .ToListAsync(cancellationToken);

    public async Task AddFiltersAsync(IEnumerable<Filter> filters, CancellationToken cancellationToken = default)
    {
        await context.Filters.AddRangeAsync(filters, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveFiltersByPresetIdAsync(int presetId, CancellationToken cancellationToken = default)
    {
        var existing = await context.Filters
            .Where(f => f.PresetId == presetId)
            .ToListAsync(cancellationToken);

        context.Filters.RemoveRange(existing);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateFiltersAsync(int presetId, IEnumerable<Filter> newFilters, CancellationToken cancellationToken = default)
    {
        var existing = await context.Filters
            .Where(f => f.PresetId == presetId)
            .ToListAsync(cancellationToken);

        context.Filters.RemoveRange(existing);

        foreach (var filter in newFilters)
        {
            context.FilterDescriptions.Attach(filter.Description);
            filter.PresetId = presetId;
        }

        await context.Filters.AddRangeAsync(newFilters, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

}