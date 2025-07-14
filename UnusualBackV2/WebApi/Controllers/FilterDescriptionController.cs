using Domain.Entities.Filtering;
using Domain.Interfaces.Repos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("descriptions")]
    [ApiController]
    public class FilterDescriptionController(IFilterDescriptionRepo descriptionRepo) : ControllerBase
    {
        [HttpGet]
        public async Task<List<FilterDescription>> GetDescriptions(CancellationToken cancellationToken) =>
            (await descriptionRepo.GetAllFilterDescriptionsAsync(cancellationToken)).ToList();
    }
}
