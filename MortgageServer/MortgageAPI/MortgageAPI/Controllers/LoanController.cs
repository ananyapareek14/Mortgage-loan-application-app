using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPI.Controllers
{
    [Route("api/loans")]
    [ApiController]
    [Authorize] // Require authentication for all endpoints
    public class LoanController : ControllerBase
    {
        private readonly ILoanRepository _loanRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<AuthController> _logger;

        public LoanController(ILoanRepository loanRepository, IMapper mapper, ILogger<AuthController> logger)
        {
            _loanRepository = loanRepository;
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


        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> SubmitLoan([FromBody] LoanRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst(JwtRegisteredClaimNames.NameId)?.Value;
            _logger.LogInformation("Submitting loan for user {UserId}", userIdClaim);

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized("Invalid or missing User ID in token.");
            }

            var loan = _mapper.Map<Loan>(request);
            loan.UserId = userId;
            loan.ApplicationDate = DateTime.UtcNow;
            loan.ApprovalStatus = LoanApprovalStatus.Pending;

            await _loanRepository.AddLoanAsync(loan);
            _logger.LogInformation("Loan submitted successfully for user {UserId}", userId);
            return Ok(new
            { 
                message = "Loan Application submitted successfully"
            });
        }

        [HttpGet("{userLoanNumber}")]
        public async Task<IActionResult> GetLoanDetails(int userLoanNumber)
        {
            var userId = GetUserIdFromToken();
            _logger.LogInformation("Fetching loan details for user {UserId} and loan number {UserLoanNumber}", userId, userLoanNumber);

            var loan = await _loanRepository.GetLoanByUserLoanNumberAsync(userLoanNumber, userId); // Pass User ID

            if (loan == null)
            {
                _logger.LogWarning("Loan not found for user {UserId} and loan number {UserLoanNumber}", userId, userLoanNumber);
                return NotFound("Loan not found.");
            }

            var loanDto = _mapper.Map<LoanDto>(loan);
            return Ok(loanDto);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLoans()
        {
            var userId = GetUserIdFromToken();
            _logger.LogInformation("Fetching all loans for user {UserId}", userId);
            var loans = await _loanRepository.GetAllLoansAsync(userId); // Pass User ID

            if (loans == null || !loans.Any())
            {
                _logger.LogWarning("No loans found for user {UserId}", userId);
                return NotFound("No loans found.");
            }

            var loansDto = _mapper.Map<IEnumerable<LoanDto>>(loans);
            return Ok(loansDto);
        }
    }
}
