namespace Domain.Entities.ExchangeData;

public class TradeStatsAnalyzed : TradeStats 
{
    public int TotalScore { get; set; } = 0;
    
    public TradeStatsAnalyzed() { }
    
    public TradeStatsAnalyzed(TradeStats dto) : base(dto) {}
}