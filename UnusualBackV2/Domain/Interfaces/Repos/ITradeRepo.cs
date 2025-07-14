using Domain.Entities.ExchangeData;
using Domain.Entities.Filtering;

namespace Domain.Interfaces.Repos;

public interface ITradeRepo
{
    IQueryable<TradeStats> GetTradeResults(FilterMessage dto, DateTime from, DateTime to);
    
}