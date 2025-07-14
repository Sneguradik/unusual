using Domain.Entities.Auth;
using Domain.Entities.Filtering;
using Domain.Interfaces.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos.Filtering;

namespace WebApi.Controllers
{
    [Route("currency")]
    [ApiController]
    public class CurrencyController(ICurrencyRepo currencyRepo) : ControllerBase
    {
        [HttpGet("all")]
        public async Task<IEnumerable<Currency>> GetAll(CancellationToken cancellationToken) => 
            await currencyRepo.GetAllCurrenciesAsync(cancellationToken);

        [HttpGet("{id}")]
        public async Task<ActionResult<Currency>> Get(int id, CancellationToken cancellationToken)
        {
            var currency = await currencyRepo.GetCurrencyAsync(id, cancellationToken);
            if (currency == null) return Problem(
                title:"Not found", statusCode: StatusCodes.Status404NotFound, 
                detail: "Currency with specified ID not found" );
            return currency;
        }

        [Authorize(Roles = RoleConst.Admin)]
        [HttpPost]
        public async Task<Currency> Create([FromBody]CurrencyCreateDto dto,
            CancellationToken cancellationToken) => await currencyRepo
            .AddCurrencyAsync(new Currency() { Name = dto.Name, Symbol = dto.Symbol}, cancellationToken);
        
        [Authorize(Roles = RoleConst.Admin)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CurrencyCreateDto dto, CancellationToken cancellationToken)
        {
            var currency = await currencyRepo.GetCurrencyAsync(id, cancellationToken);
            if (currency is null) return 
                Problem("Currency with specified ID not found" , statusCode: StatusCodes.Status404NotFound, title:  "Not found");
            currency.Name = dto.Name;
            currency.Symbol = dto.Symbol;
            await currencyRepo
                .UpdateCurrencyAsync(currency, cancellationToken);
            return NoContent();
        }
        
        [Authorize(Roles = RoleConst.Admin)]
        [HttpDelete]
        public async Task Delete(CurrencyDeleteDto dto, CancellationToken cancellationToken) => await currencyRepo
            .DeleteCurrencyAsync(dto.Ids,  cancellationToken);
        
    }
}
