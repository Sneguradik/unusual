using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DbContext;

public class TradeDbContext(DbContextOptions<TradeDbContext> options) : Microsoft.EntityFrameworkCore.DbContext(options)
{
    
}