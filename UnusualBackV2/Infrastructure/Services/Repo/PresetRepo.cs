using Domain.Entities.Auth;
using Domain.Entities.Filtering;
using Domain.Interfaces.Repos;
using Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services.Repo;

public class PresetRepo(MainDbContext context) : IPresetRepo
{
    private static IQueryable<Preset> FilterPublic(IQueryable<Preset> presets, bool publicOnly) => 
        publicOnly ? presets.Where(x=>x.IsPublic) : presets;
    
    public async Task<IEnumerable<Preset>> GetAllPresetsAsync(int take, int skip, bool publicOnly = false,
        CancellationToken cancellationToken = default) => await 
        FilterPublic(context.Presets, publicOnly)
            .AsNoTracking()
            .Skip(skip)
            .Take(take)
            .Include(p=>p.Owner)
            .AsSplitQuery()
            .ToArrayAsync(cancellationToken);

    public async Task<IEnumerable<Preset>> GetAllPresetsAsync(bool publicOnly = false, 
        CancellationToken cancellationToken = default) => await 
        FilterPublic(context.Presets, publicOnly)
            .AsNoTracking()
            .Include(p=>p.Owner)
            .Include(p=>p.Currency)
            .AsSplitQuery()
            .ToArrayAsync(cancellationToken);

    public async Task<Preset?> GetPresetAsync(int id, CancellationToken cancellationToken = default) => await context
        .Presets.FindAsync([id], cancellationToken);

    public async Task<Preset> AddPresetAsync(Preset preset, CancellationToken cancellationToken = default)
    {
        context.Attach(preset.Owner);
        
        context.Attach(preset.Currency);
        
        foreach (var filter in preset.Filters) context.Attach(filter.Description);
        
        await context.Presets.AddAsync(preset, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return preset;
    }

    public async Task UpdatePresetAsync(Preset updated, CancellationToken cancellationToken = default)
    {
        
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeletePresetAsync(IEnumerable<int> id, CancellationToken cancellationToken = default)
    {
        var result = await context.Presets.Where(x=>id.Contains(x.Id)).ExecuteDeleteAsync(cancellationToken);
        return result != 0;
    }

    public async Task<IEnumerable<Preset>> GetPresetsByUserAsync(User user, bool publicOnly = false, 
        CancellationToken cancellationToken = default) => await FilterPublic(context.Presets, publicOnly)
        .AsNoTracking()
        .AsSplitQuery()
        .Where(x=>x.Owner.Id == user.Id)
        .ToArrayAsync(cancellationToken);
        
    public async Task<IEnumerable<Preset>> GetPresetsByQueryAsync(string query, bool publicOnly = false, 
        CancellationToken cancellationToken = default) => await FilterPublic(context.Presets, publicOnly)
            .AsNoTracking()
            .AsSplitQuery()
            .Where(x=>x.Name.ToLower().Contains(query.ToLower()))
            .ToArrayAsync(cancellationToken);

    public async Task<Preset?> GetDefaultPresetAsync(Currency currency, CancellationToken cancellationToken = default)
    {
        var pair = await context
            .DefaultPresets
            .Include(x => x.Currency)
            .Include(defaultPreset => defaultPreset.Preset)
            .FirstOrDefaultAsync(x => x.Currency == currency, cancellationToken);
        return pair?.Preset;
    }
}