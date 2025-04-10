using Serilog;

namespace MortgageAPI.Extensions
{
    public static class SerilogExtension
    {
        public static void AddSerilogLogging(this ConfigureHostBuilder hostBuilder, IConfiguration configuration)
        {
            //Log.Logger = new LoggerConfiguration()
            //    .ReadFrom.Configuration(configuration)
            //    .Enrich.FromLogContext()
            //    .WriteTo.Console()
            //    .WriteTo.File("Logs/mortgage-log-.txt", rollingInterval: RollingInterval.Day)
            //    .CreateLogger();

            //hostBuilder.UseSerilog();
            Log.Logger = new LoggerConfiguration()
            .ReadFrom.Configuration(configuration) // Only this line!
            .Enrich.FromLogContext()
            .CreateLogger();

            hostBuilder.UseSerilog();
        }
    }
}
