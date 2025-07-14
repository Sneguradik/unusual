using Domain.Entities.Auth;
using Domain.Entities.ExchangeData;
using Domain.Entities.Filtering;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DbContext;

public class MainDbContext(DbContextOptions<MainDbContext> options)  : IdentityDbContext<User,  IdentityRole<int>, int>(options)
{
    public DbSet<TradeStatsAnalyzed> TradeStats { get; set; }
    public DbSet<Currency> Currencies { get; set; }
    public DbSet<FilterDescription>  FilterDescriptions { get; set; }
    public DbSet<Filter> Filters { get; set; }
    public DbSet<Preset>  Presets { get; set; }
    public DbSet<DefaultPreset>  DefaultPresets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<FilterDescription>()
            .HasMany<Filter>()
            .WithOne()
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<Preset>()
            .HasMany(p => p.Filters)
            .WithOne(f => f.Preset)
            .HasForeignKey(f => f.PresetId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Filter>().Navigation(x => x.Description).AutoInclude();

        modelBuilder.Entity<Preset>().Navigation(x => x.Filters).AutoInclude();
        modelBuilder.Entity<Preset>().Navigation(x => x.Currency).AutoInclude();
        modelBuilder.Entity<Preset>().Navigation(x => x.Owner).AutoInclude();

        modelBuilder.Entity<Preset>()
            .HasOne<User>(x => x.Owner)
            .WithMany();

        modelBuilder.Entity<Currency>()
            .HasMany<Preset>()
            .WithOne(x=>x.Currency)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<DefaultPreset>()
            .HasOne<Preset>(e => e.Preset)
            .WithOne()
            .HasForeignKey<DefaultPreset>(x => x.PresetId).OnDelete(DeleteBehavior.SetNull);
        
        modelBuilder.Entity<DefaultPreset>()
            .HasOne<Currency>(e => e.Currency)
            .WithOne()
            .HasForeignKey<DefaultPreset>(x => x.CurrencyId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<TradeStatsAnalyzed>()
            .HasKey(x=>new {x.TradeDate, x.Currency, x.TradeMemberName, x.Account, x.ClientCode});

    }
    
}