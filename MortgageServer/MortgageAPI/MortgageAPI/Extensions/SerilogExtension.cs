using Serilog;

namespace MortgageAPI.Extensions
{
    public static class SerilogExtension
    {
        public static void AddSerilogLogging(this ConfigureHostBuilder hostBuilder, IConfiguration configuration)
        {
            Log.Logger = new LoggerConfiguration()
            .ReadFrom.Configuration(configuration)
            .Enrich.FromLogContext()
            .CreateLogger();

            hostBuilder.UseSerilog();
        }
    }
}
