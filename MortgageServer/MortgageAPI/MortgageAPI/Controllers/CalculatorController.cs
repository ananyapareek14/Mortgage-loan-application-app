using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MortgageAPI.Models.DTO;
//using MortgageAPI.Repos;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPI.Controllers
{
    [Route("api")]
    [ApiController]
    [Authorize]
    public class CalculatorController : ControllerBase
    {
        private readonly ICalculatorRepository _calculator;
        private readonly IMapper _mapper;
        private readonly ILogger<CalculatorController> _logger;

        public CalculatorController(ICalculatorRepository calculator, IMapper mapper, ILogger<CalculatorController> logger)
        {
            _calculator = calculator;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("affordability/calculate")]
        public ActionResult<AffordabilityCalculationResult> CalculateAffordability([FromBody] AffordabilityCalculationRequest request)
        {
            try
            {
                var result = _calculator.CalculateAffordability(request);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("debt-to-income/calculate")]
        public ActionResult<DtiCalculationResult> CalculateDti([FromBody] DtiCalculationRequest request)
        {
            if (request.AnnualIncome <= 0)
                return BadRequest("Annual income must be greater than zero.");

            var result = _calculator.CalculateDti(request);
            return Ok(result);
        }

        [HttpPost("refinance/calculate")]
        public ActionResult<RefinanceCalculationResult> CalculateRefinance([FromBody] RefinanceCalculationRequest request)
        {
            try
            {
                var result = _calculator.CalculateRefinance(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPost("va-mortgage-schedule/calculate")]
        public IActionResult CalculateSchedule([FromBody] VaMortgageCalculationRequest request)
        {
            if (request.HomePrice <= 0 || request.LoanTermYears <= 0 || request.InterestRate <= 0)
            {
                return BadRequest("Invalid input. Please ensure all fields are positive numbers.");
            }

            var schedule = _calculator.CalculateSchedule(request);
            return Ok(schedule);
        }

        [HttpPost("amortization/calculate")]
        public async Task<IActionResult> CalculateAmortization([FromBody] LoanRequest loanRequest)
        {
            _logger.LogInformation("Calculating amortization: Amount={Amount}, Term={Term}, Rate={Rate}",
                loanRequest.LoanAmount, loanRequest.LoanTermYears, loanRequest.InterestRate);

            if (loanRequest.LoanAmount <= 0 || loanRequest.LoanTermYears <= 0 || loanRequest.InterestRate <= 0)
            {
                _logger.LogWarning("Invalid loan data provided");
                return BadRequest("Invalid loan details. Ensure all values are greater than zero.");
            }

            var schedule = await _calculator.GenerateAmortizationScheduleAsync(loanRequest);
            var scheduleDto = _mapper.Map<IEnumerable<AmortizationScheduleDto>>(schedule);

            return Ok(scheduleDto);
        }
    }
}
