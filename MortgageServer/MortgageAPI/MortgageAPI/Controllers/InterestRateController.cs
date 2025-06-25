using Microsoft.AspNetCore.Mvc;
using MortgageAPI.Repos.Helper.Interface;
using MortgageAPI.Models.Domain;

namespace MortgageAPI.Controllers
{
    [Route("api/interest-rate")]
    [ApiController]
    public class InterestRateController : ControllerBase
    {
        private readonly IRateProvider _rateProvider;
        private readonly ILogger<InterestRateController> _logger;

        public InterestRateController(IRateProvider rateProvider, ILogger<InterestRateController> logger)
        {
            _rateProvider = rateProvider;
            _logger = logger;
        }

        [HttpGet("fixed")]
        public IActionResult GetFixedRate([FromQuery] int termYears = 30)
        {
            try
            {
                var today = DateTime.UtcNow;
                var (rateDate, rawRate, term) = _rateProvider.GetClosestFreddieRate(termYears, today);

                var isFallback = rateDate < today;

                if (isFallback)
                {
                    _logger.LogWarning("Fallback rate used for term {TermYears}. Closest available date: {RateDate}", termYears, rateDate);
                }

                return Ok(new
                {
                    TermYears = termYears,
                    ClosestDate = rateDate.ToShortDateString(),
                    InterestRate = rawRate,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching fixed rate.");
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpGet("arm")]
        public IActionResult GetSofrRates()
        {
            try
            {
                var today = DateTime.UtcNow;
                var baseRates = _rateProvider.GetRawSofrRatesUpTo(today);

                if (baseRates.Count == 0)
                    return NotFound(new { message = "No SOFR rates available up to today." });

                return Ok(new
                {
                    ClosestDate = baseRates.First().date.ToShortDateString(),
                    InterestRate = baseRates.First().rate,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching SOFR rates.");
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
