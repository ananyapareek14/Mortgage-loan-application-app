using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPI.Controllers
{
    [Route("api/interestrates")]
    [ApiController]
    public class InterestRateController : ControllerBase
    {
        private readonly IInterestRateRepository _interestRateRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<InterestRateController> _logger;

        public InterestRateController(IInterestRateRepository interestRateRepository, IMapper mapper, ILogger<InterestRateController> logger)
        {
            _interestRateRepository = interestRateRepository;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetInterestRates()
        {
            _logger.LogInformation("Fetching interest rates");
            var rates = await _interestRateRepository.GetAllInterestRatesAsync();
            var rateDtos = _mapper.Map<IEnumerable<InterestRateDto>>(rates);
            return Ok(rateDtos);
        }
    }
}
