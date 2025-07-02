//using Microsoft.AspNetCore.Mvc;
//using MortgageAPI.Repos.Helper.Interface;
//using MortgageAPI.Models.Domain;

//namespace MortgageAPI.Controllers
//{
//    [Route("api/interest-rate")]
//    [ApiController]
//    public class InterestRateController : ControllerBase
//    {
//        private readonly IRateProvider _rateProvider;
//        private readonly ILogger<InterestRateController> _logger;

//        public InterestRateController(IRateProvider rateProvider, ILogger<InterestRateController> logger)
//        {
//            _rateProvider = rateProvider;
//            _logger = logger;
//        }

//        [HttpGet("fixed")]
//        public IActionResult GetFixedRate([FromQuery] int termYears = 30)
//        {
//            try
//            {
//                var today = DateTime.UtcNow;
//                var (rateDate, rawRate, term) = _rateProvider.GetClosestFreddieRate(termYears, today);

//                var isFallback = rateDate < today;

//                if (isFallback)
//                {
//                    _logger.LogWarning("Fallback rate used for term {TermYears}. Closest available date: {RateDate}", termYears, rateDate);
//                }

//                return Ok(new
//                {
//                    TermYears = termYears,
//                    ClosestDate = rateDate.ToShortDateString(),
//                    InterestRate = rawRate,
//                });
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error fetching fixed rate.");
//                return BadRequest(new { message = ex.Message });
//            }
//        }


//        [HttpGet("arm")]
//        public IActionResult GetSofrRates()
//        {
//            try
//            {
//                var today = DateTime.UtcNow;
//                var baseRates = _rateProvider.GetRawSofrRatesUpTo(today);

//                if (baseRates.Count == 0)
//                    return NotFound(new { message = "No SOFR rates available up to today." });

//                return Ok(new
//                {
//                    ClosestDate = baseRates.First().date.ToShortDateString(),
//                    InterestRate = baseRates.First().rate,
//                });
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error fetching SOFR rates.");
//                return BadRequest(new { message = ex.Message });
//            }
//        }
//    }
//}



//using Microsoft.AspNetCore.Mvc;
//using MortgageAPI.Repos.Helper.Interface;
//using MortgageAPI.Models.Domain;

//namespace MortgageAPI.Controllers
//{
//    [Route("api/interest-rate")]
//    [ApiController]
//    public class InterestRateController : ControllerBase
//    {
//        private readonly IRateProvider _rateProvider;
//        private readonly ILogger<InterestRateController> _logger;

//        public InterestRateController(IRateProvider rateProvider, ILogger<InterestRateController> logger)
//        {
//            _rateProvider = rateProvider;
//            _logger = logger;
//        }

//        [HttpGet]
//        public IActionResult GetCombinedRates([FromQuery] int fixedTermYears = 30)
//        {
//            try
//            {
//                var today = DateTime.UtcNow;

//                // === FIXED RATE ===
//                var (fixedDate, fixedRate, fixedLabel) = _rateProvider.GetClosestFreddieRate(fixedTermYears, today);
//                var isFixedFallback = fixedDate < today;

//                if (isFixedFallback)
//                {
//                    _logger.LogWarning("Fallback fixed rate used for {Label}. Closest available date: {Date}", fixedLabel, fixedDate);
//                }

//                // === ARM RATE ===
//                var baseSofrRates = _rateProvider.GetRawSofrRatesUpTo(today);
//                if (baseSofrRates.Count == 0)
//                {
//                    return NotFound(new { message = "No SOFR ARM rates found up to today." });
//                }

//                var armDate = baseSofrRates.First().date;
//                var armRate = baseSofrRates.First().rate;

//                // === Combined Response ===
//                return Ok(new
//                {
//                    Fixed = new
//                    {
//                        TermYears = fixedTermYears,
//                        TermLabel = fixedLabel,
//                        ClosestDate = fixedDate.ToShortDateString(),
//                        InterestRate = fixedRate,
//                        IsFallback = isFixedFallback
//                    },
//                    ARM = new
//                    {
//                        ClosestDate = armDate.ToShortDateString(),
//                        InterestRate = armRate
//                    }
//                });
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error fetching interest rates.");
//                return BadRequest(new { message = ex.Message });
//            }
//        }
//    }
//}




using Microsoft.AspNetCore.Mvc;
using MortgageAPI.Repos.Helper.Interface;
using Microsoft.Extensions.Logging;
using MortgageAPI.Models.DTO;

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

        //[HttpGet]
        //public IActionResult GetCombinedRates([FromQuery] int fixedTermYears = 30)
        //{
        //    try
        //    {
        //        var today = DateTime.UtcNow;

        //        // === FIXED RATE ===
        //        var (fixedDate, fixedRate, fixedLabel) = _rateProvider.GetClosestFreddieRate(fixedTermYears, today);
        //        var isFixedFallback = fixedDate < today;

        //        if (isFixedFallback)
        //        {
        //            _logger.LogWarning("Fallback fixed rate used for {Label}. Closest available date: {Date}", fixedLabel, fixedDate);
        //        }

        //        var fixedRateEntry = new
        //        {
        //            Type = "Fixed",
        //            TermYears = fixedTermYears,
        //            TermLabel = fixedLabel,
        //            ClosestDate = fixedDate.ToShortDateString(),
        //            InterestRate = fixedRate,
        //            IsFallback = isFixedFallback
        //        };

        //        // === ARM RATE ===
        //        var baseSofrRates = _rateProvider.GetRawSofrRatesUpTo(today);
        //        if (baseSofrRates.Count == 0)
        //        {
        //            return NotFound(new { message = "No SOFR ARM rates found up to today." });
        //        }

        //        var armDate = baseSofrRates.First().date;
        //        var armRate = baseSofrRates.First().rate;

        //        var armRateEntry = new
        //        {
        //            Type = "ARM",
        //            ClosestDate = armDate.ToShortDateString(),
        //            InterestRate = armRate
        //        };

        //        // === COMBINED RESPONSE ===
        //        return Ok(new
        //        {
        //            Rates = new[] { fixedRateEntry, armRateEntry }
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Error fetching interest rates.");
        //        return BadRequest(new { message = ex.Message });
        //    }
        //}


        [HttpGet]
        public IActionResult GetCombinedRates([FromQuery] int fixedTermYears = 30)
        {
            try
            {
                var today = DateTime.UtcNow;

                var (fixedDate, fixedRate, fixedLabel) = _rateProvider.GetClosestFreddieRate(fixedTermYears, today);
                var isFixedFallback = fixedDate < today;

                var fixedRateEntry = new InterestRateDto
                {
                    Type = "Fixed",
                    TermYears = fixedTermYears,
                    TermLabel = fixedLabel,
                    ClosestDate = fixedDate.ToShortDateString(),
                    InterestRate = fixedRate,
                    IsFallback = isFixedFallback
                };

                var baseSofrRates = _rateProvider.GetRawSofrRatesUpTo(today);
                if (baseSofrRates.Count == 0)
                {
                    return NotFound(new { message = "No SOFR ARM rates found up to today." });
                }

                var armDate = baseSofrRates.First().date;
                var armRate = baseSofrRates.First().rate;

                var armRateEntry = new InterestRateDto
                {
                    Type = "ARM",
                    ClosestDate = armDate.ToShortDateString(),
                    InterestRate = armRate
                };

                return Ok(new
                {
                    Rates = new List<InterestRateDto> { fixedRateEntry, armRateEntry }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching interest rates.");
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

