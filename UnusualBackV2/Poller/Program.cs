using Application.DI;
using Infrastructure.DI;
using Poller;
using Quartz;

var builder = Host.CreateApplicationBuilder(args);
builder.Services
    .AddQuartzHostedService()
    .AddInfrastructureServices()
    .AddServices()
    .AddDataBases(builder.Configuration.GetConnectionString("SPBE"),
    builder.Configuration.GetConnectionString("MainDb"));

builder.Services.AddQuartz(q =>
{
    

    var jobKey = new JobKey(nameof(FilteringJob));

    q.AddJob<FilteringJob>(opts => opts.WithIdentity(jobKey));
    q.AddTrigger(opts => opts
        .ForJob(jobKey)
        .WithIdentity(nameof(FilteringJob))
        .WithSimpleSchedule(x => x
            .WithIntervalInHours(2)
            .RepeatForever()));
});

var host = builder.Build();
host.Run();