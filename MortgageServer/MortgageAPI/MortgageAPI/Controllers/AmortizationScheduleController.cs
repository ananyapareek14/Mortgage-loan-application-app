using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPI.Controllers
{
    [Route("api/amortization")]
    [ApiController]
    [Authorize]
    public class AmortizationController : ControllerBase
    {
        private readonly IAmortizationScheduleRepository _amortizationRepository;
        private readonly IMapper _mapper;

        public AmortizationController(IAmortizationScheduleRepository amortizationRepository, IMapper mapper)
        {
            _amortizationRepository = amortizationRepository;
            _mapper = mapper;
        }

        [HttpGet("{loanId}")]
        public async Task<IActionResult> GetAmortizationSchedule(Guid loanId)
        {
            var schedule = await _amortizationRepository.GetScheduleByLoanIdAsync(loanId);
            var scheduleDto = _mapper.Map<IEnumerable<AmortizationScheduleDto>>(schedule);
            return Ok(scheduleDto);
        }
    }
}
