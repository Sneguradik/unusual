using Domain.Entities.Auth;
using Domain.Entities.Filtering;

namespace Domain.Interfaces.Repos;

public interface IPresetRepo
{
    Task<IEnumerable<Preset>> GetAllPresetsAsync(int take, int skip, bool publicOnly = false, CancellationToken cancellationToken = default);
    Task<IEnumerable<Preset>> GetAllPresetsAsync(bool publicOnly = false, CancellationToken cancellationToken = default);
    Task<Preset?> GetPresetAsync(int id, CancellationToken cancellationToken = default);
    Task<Preset> AddPresetAsync(Preset preset, CancellationToken cancellationToken = default);
    Task UpdatePresetAsync(Preset preset, CancellationToken cancellationToken = default);
    Task<bool> DeletePresetAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default);
    Task<IEnumerable<Preset>> GetPresetsByUserAsync(User user, bool publicOnly = false, CancellationToken cancellationToken = default);
    Task<IEnumerable<Preset>> GetPresetsByQueryAsync(string query, bool publicOnly = false, CancellationToken cancellationToken = default);
    Task<DefaultPreset?> GetDefaultPresetAsync(Currency currency, CancellationToken cancellationToken = default);
}