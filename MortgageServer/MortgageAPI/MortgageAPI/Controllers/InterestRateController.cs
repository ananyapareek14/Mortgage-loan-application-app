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

        public InterestRateController(IInterestRateRepository interestRateRepository, IMapper mapper)
        {
            _interestRateRepository = interestRateRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetInterestRates()
        {
            var rates = await _interestRateRepository.GetAllInterestRatesAsync();
            var rateDtos = _mapper.Map<IEnumerable<InterestRateDto>>(rates);
            return Ok(rateDtos);
        }
    }
}
