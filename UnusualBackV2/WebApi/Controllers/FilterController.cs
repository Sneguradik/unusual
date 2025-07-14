using Domain.Dto;
using Domain.Entities.ExchangeData;
using Domain.Entities.Filtering;
using Domain.Interfaces.Filtering;
using Domain.Interfaces.Repos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos.Filtering;

namespace WebApi.Controllers
{
    [Route("/filter")]
    [ApiController]
    public class FilterController(
        ITradeRepo tradeRepository,
        IFilterApplyingService filterService,
        IHistoricTradesRepo historicRepo,
        IPresetRepo presetRepo,
        ILogger<FilterController> logger) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<TradeStatsAnalyzed[]>> GetData([FromBody] FilteringRequestDto dto, CancellationToken token)
        {
            if (dto.StartDate > dto.EndDate)
            {
                return Problem(title: "Invalid data",
                    statusCode: StatusCodes.Status400BadRequest,
                    detail: "Start date cannot be earlier than end date",
                    instance: HttpContext.Request.Path);
            }

            logger.LogInformation($"Requested from {dto.StartDate:yyyy-MM-dd} to {dto.EndDate:yyyy-MM-dd}. Currency: {dto.Currency}.");

            if (dto.PresetId.HasValue)
            {
                var preset = await presetRepo.GetPresetAsync(dto.PresetId.Value, token);
                if (preset?.IsDefault == true)
                {
                    var defaultTrades = await historicRepo.GetDefaultTradesByCurrencyAsync(dto.Currency, 200, token);
                    return defaultTrades.ToArray();
                }
            }

            var tradeStats = await filterService.ApplyFilters(
                tradeRepository.GetTradeResults(dto, dto.StartDate, dto.EndDate),
                dto.Filters,
                token: token);

            logger.LogInformation($"Filtered from {dto.StartDate:yyyy-MM-dd} to {dto.EndDate:yyyy-MM-dd}. Currency: {dto.Currency}.");
            return tradeStats.ToArray();
        }

        [HttpGet("stats_by_currency")]
        public async Task<ActionResult<List<DealsStatsByCurrencyDto>>> GetRecentCurrencyStats(CancellationToken token)
        {
            var fromDate = DateTime.UtcNow.Date.AddDays(-14);
            var result = await historicRepo.CountRecentTradesByCurrencyAsync(fromDate, token);
            return Ok(result);
        }
        
    }
}
