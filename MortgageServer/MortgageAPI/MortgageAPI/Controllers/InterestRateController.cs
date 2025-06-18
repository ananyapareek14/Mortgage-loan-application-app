//using AutoMapper;
//using Microsoft.AspNetCore.Mvc;
//using MortgageAPI.Models.DTO;
//using MortgageAPI.Repos.Interfaces;

//namespace MortgageAPI.Controllers
//{
//    [Route("api/interestrates")]
//    [ApiController]
//    public class InterestRateController : ControllerBase
//    {
//        private readonly IInterestRateRepository _interestRateRepository;
//        private readonly IMapper _mapper;
//        private readonly ILogger<InterestRateController> _logger;

//        public InterestRateController(IInterestRateRepository interestRateRepository, IMapper mapper, ILogger<InterestRateController> logger)
//        {
//            _interestRateRepository = interestRateRepository;
//            _mapper = mapper;
//            _logger = logger;
//        }

//        //[HttpGet]
//        //public async Task<IActionResult> GetInterestRates()
//        //{
//        //    _logger.LogInformation("Fetching interest rates");
//        //    var rates = await _interestRateRepository.GetAllInterestRatesAsync();
//        //    var rateDtos = _mapper.Map<IEnumerable<InterestRateDto>>(rates);
//        //    return Ok(rateDtos);
//        //}


//        //[HttpGet]
//        //public async Task<IActionResult> GetInterestRates()
//        //{
//        //    try
//        //    {
//        //        _logger.LogInformation("Fetching interest rates");
//        //        var rates = await _interestRateRepository.GetAllInterestRatesAsync();
//        //        var rateDtos = _mapper.Map<IEnumerable<InterestRateDto>>(rates);
//        //        return Ok(rateDtos);
//        //    }
//        //    catch (Exception ex)
//        //    {
//        //        _logger.LogError(ex, "Error occurred while fetching interest rates");
//        //        return StatusCode(500, "An error occurred while processing your request.");
//        //    }
//        //}

//        [HttpGet]
//        public async Task<IActionResult> GetInterestRates()
//        {
//            try
//            {
//                _logger.LogInformation("Fetching interest rates");
//                var rates = await _interestRateRepository.GetAllInterestRatesAsync();
//                var rateDtos = _mapper.Map<IEnumerable<InterestRateDto>>(rates);

//                if (rateDtos == null)
//                {
//                    throw new Exception("Mapping result was null");
//                }

//                return Ok(rateDtos);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error occurred while fetching interest rates");
//                return StatusCode(500, "An error occurred while processing your request.");
//            }
//        }


//    }
//}
