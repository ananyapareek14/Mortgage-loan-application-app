using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MortgageAPI.Controllers
{
    [Route("api/amortization")]
    [ApiController]
    [Authorize]
    public class AmortizationController : ControllerBase
    {
        private readonly IAmortizationScheduleRepository _amortizationRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<AmortizationController> _logger;

        public AmortizationController(IAmortizationScheduleRepository amortizationRepository, IMapper mapper, ILogger<AmortizationController> logger)
        {
            _amortizationRepository = amortizationRepository;
            _mapper = mapper;
            _logger = logger;
        }

        private Guid GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst(JwtRegisteredClaimNames.NameId)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                throw new UnauthorizedAccessException("Invalid or missing User ID in token.");
            }

            return userId;
        }

        [HttpPost("calculate")]
        public async Task<IActionResult> CalculateAmortization([FromBody] LoanRequest loanRequest)
        {
            _logger.LogInformation("Calculating amortization: Amount={Amount}, Term={Term}, Rate={Rate}",
                loanRequest.LoanAmount, loanRequest.LoanTermYears, loanRequest.InterestRate);

            if (loanRequest.LoanAmount <= 0 || loanRequest.LoanTermYears <= 0 || loanRequest.InterestRate <= 0)
            {
                _logger.LogWarning("Invalid loan data provided");
                return BadRequest("Invalid loan details. Ensure all values are greater than zero.");
            }

            var schedule = await _amortizationRepository.GenerateAmortizationScheduleAsync(loanRequest);
            var scheduleDto = _mapper.Map<IEnumerable<AmortizationScheduleDto>>(schedule);

            return Ok(scheduleDto);
        }

        [HttpGet("{userLoanNumber}")]
        public async Task<IActionResult> GetSchedule(int userLoanNumber)
        {
            var userId = GetUserIdFromToken(); // From JWT
            _logger.LogInformation("Fetching amortization schedule for user {UserId} and loan {LoanNumber}", userId, userLoanNumber);

            var schedule = await _amortizationRepository.GetScheduleByUserLoanNumberAsync(userId, userLoanNumber);

            if (!schedule.Any())
            {
                _logger.LogWarning("No schedule found for user {UserId} and loan {LoanNumber}", userId, userLoanNumber);
                return NotFound("Schedule not found.");
            }

            var scheduleDto = _mapper.Map<IEnumerable<AmortizationScheduleDto>>(schedule);
            return Ok(scheduleDto);
        }
    }
}
