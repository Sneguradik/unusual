using Domain.Interfaces.Filtering;
using Quartz;

namespace Poller;

public class FilteringJob(IPassiveFilteringService filteringService) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
       await filteringService.RunAsync(context.CancellationToken);
    }
}