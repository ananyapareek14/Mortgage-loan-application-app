using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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

        public LoanController(ILoanRepository loanRepository, IMapper mapper)
        {
            _loanRepository = loanRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitLoan([FromBody] LoanRequest request)
        {
            // Try to retrieve User ID from token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst(JwtRegisteredClaimNames.NameId)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized("Invalid or missing User ID in token.");
            }

            var loan = _mapper.Map<Loan>(request);
            loan.LoanId = Guid.NewGuid();
            loan.UserId = userId;
            loan.ApplicationDate = DateTime.UtcNow;
            loan.ApprovalStatus = LoanApprovalStatus.Pending;

            await _loanRepository.AddLoanAsync(loan);
            return Ok("Loan application submitted.");
        }


        [HttpGet("{loanId}")]
        public async Task<IActionResult> GetLoanDetails(Guid loanId)
        {
            var loan = await _loanRepository.GetLoanByIdAsync(loanId);
            if (loan == null) return NotFound("Loan not found.");

            var loanDto = _mapper.Map<LoanDto>(loan);
            return Ok(loanDto);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLoans()
        {
            var loan = await _loanRepository.GetAllLoansAsync();
            if (loan == null) return NotFound("No loans found");

            var loansDto = _mapper.Map<IEnumerable<LoanDto>>(loan);
            return Ok(loansDto);
        }
    }
}
