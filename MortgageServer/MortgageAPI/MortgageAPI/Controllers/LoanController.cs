//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using AutoMapper;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using MortgageAPI.Models.Domain;
//using MortgageAPI.Models.DTO;
//using MortgageAPI.Repos.Interfaces;

//namespace MortgageAPI.Controllers
//{
//    [Route("api/loans")]
//    [ApiController]
//    [Authorize]
//    public class LoanController : ControllerBase
//    {
//        private readonly ILoanRepository _loanRepository;
//        private readonly IMapper _mapper;
//        private readonly ILogger<LoanController> _logger;

//        public LoanController(ILoanRepository loanRepository, IMapper mapper, ILogger<LoanController> logger)
//        {
//            _loanRepository = loanRepository;
//            _mapper = mapper;
//            _logger = logger;
//        }

//        private Guid GetUserIdFromToken()
//        {
//            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
//                              ?? User.FindFirst(JwtRegisteredClaimNames.NameId)?.Value;

//            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
//            {
//                throw new UnauthorizedAccessException("Invalid or missing User ID in token.");
//            }

//            return userId;
//        }

//        [HttpPost]
//        [Authorize(Roles = "User")]
//        public async Task<IActionResult> SubmitLoan([FromBody] LoanRequest request)
//        {
//            try
//            {
//                var userId = GetUserIdFromToken();
//                _logger.LogInformation("Submitting loan for user {UserId}", userId);

//                var loan = _mapper.Map<Loan>(request);
//                loan.UserId = userId;
//                loan.ApplicationDate = DateTime.UtcNow;
//                loan.ApprovalStatus = LoanApprovalStatus.Pending;

//                await _loanRepository.AddLoanAsync(loan);
//                _logger.LogInformation("Loan submitted successfully for user {UserId}", userId);

//                return Ok(new LoanResponse
//                {
//                    Message = "Loan Application submitted successfully"
//                });
//            }
//            catch (UnauthorizedAccessException ex)
//            {
//                _logger.LogWarning(ex, "Unauthorized loan submission attempt.");
//                return Unauthorized(ex.Message);
//            }
//        }


//        [HttpGet("{userLoanNumber}")]
//        public async Task<IActionResult> GetLoanDetails(int userLoanNumber)
//        {
//            var userId = GetUserIdFromToken();
//            _logger.LogInformation("Fetching loan details for user {UserId} and loan number {UserLoanNumber}", userId, userLoanNumber);

//            var loan = await _loanRepository.GetLoanByUserLoanNumberAsync(userLoanNumber, userId); // Pass User ID

//            if (loan == null)
//            {
//                _logger.LogWarning("Loan not found for user {UserId} and loan number {UserLoanNumber}", userId, userLoanNumber);
//                return NotFound("Loan not found.");
//            }

//            var loanDto = _mapper.Map<LoanDto>(loan);
//            return Ok(loanDto);
//        }

//        [HttpGet]
//        public async Task<IActionResult> GetAllLoans()
//        {
//            var userId = GetUserIdFromToken();
//            _logger.LogInformation("Fetching all loans for user {UserId}", userId);
//            var loans = await _loanRepository.GetAllLoansAsync(userId); // Pass User ID

//            if (loans == null || !loans.Any())
//            {
//                _logger.LogWarning("No loans found for user {UserId}", userId);
//                return NotFound("No loans found.");
//            }

//            var loansDto = _mapper.Map<IEnumerable<LoanDto>>(loans);
//            return Ok(loansDto);
//        }
//    }
//}


using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;
using MortgageAPI.Repos.Helper.Interface;

namespace MortgageAPI.Controllers
{
    [Route("api/loans")]
    [ApiController]
    [Authorize]
    public class LoanController : ControllerBase
    {
        private readonly ILoanRepository _loanRepository;
        private readonly IAmortizationCalculator _amortizationCalculator;
        private readonly IMapper _mapper;
        private readonly ILogger<LoanController> _logger;

        public LoanController(
            ILoanRepository loanRepository,
            IAmortizationCalculator amortizationCalculator,
            IMapper mapper,
            ILogger<LoanController> logger)
        {
            _loanRepository = loanRepository;
            _amortizationCalculator = amortizationCalculator;
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

        //[HttpPost]
        //[Authorize(Roles = "User")]
        //public async Task<IActionResult> SubmitLoan([FromBody] LoanRequest request)
        //{
        //    try
        //    {
        //        var userId = GetUserIdFromToken();
        //        _logger.LogInformation("Submitting loan for user {UserId}", userId);

        //        var loan = _mapper.Map<Loan>(request);
        //        loan.UserId = userId;
        //        loan.LoanId = Guid.NewGuid();
        //        loan.ApplicationDate = DateTime.UtcNow;
        //        loan.ApprovalStatus = LoanApprovalStatus.Pending;

        //        // Compute Amortization Schedule
        //        var schedule = _amortizationCalculator.GenerateSchedule(loan);
        //        loan.AmortizationSchedules = schedule;

        //        // Save loan + schedule
        //        await _loanRepository.AddLoanAsync(loan);

        //        _logger.LogInformation("Loan with amortization schedule submitted successfully for user {UserId}", userId);

        //        return Ok(new LoanResponse
        //        {
        //            Message = "Loan Application and Amortization Schedule saved successfully"
        //        });
        //    }
        //    catch (UnauthorizedAccessException ex)
        //    {
        //        _logger.LogWarning(ex, "Unauthorized loan submission attempt.");
        //        return Unauthorized(ex.Message);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "An error occurred while submitting the loan.");
        //        return StatusCode(500, "An error occurred while submitting the loan.");
        //    }
        //}

        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> SubmitLoan([FromBody] LoanRequest request)
        {
            try
            {
                var userId = GetUserIdFromToken();
                _logger.LogInformation("Submitting loan for user {UserId}", userId);

                // ✅ Look up the matching loan product by name (or use ProductCode if you have that column)
                var product = await _loanRepository
                    .GetLoanProductByNameAsync(request.ProductCode); // you'll implement this method

                if (product == null)
                {
                    _logger.LogWarning("Loan product not found for code {ProductCode}", request.ProductCode);
                    return BadRequest("Invalid loan product code.");
                }

                var loan = _mapper.Map<Loan>(request);
                loan.UserId = userId;
                loan.LoanId = Guid.NewGuid();
                loan.ApplicationDate = DateTime.UtcNow;
                loan.ApprovalStatus = LoanApprovalStatus.Pending;

                // ✅ Attach loan product
                loan.LoanProductId = product.LoanProductId;
                loan.LoanProduct = product;

                // Compute Amortization Schedule
                var schedule = _amortizationCalculator.GenerateSchedule(loan);
                loan.AmortizationSchedules = schedule;

                // Save loan + schedule
                await _loanRepository.AddLoanAsync(loan);

                _logger.LogInformation("Loan with amortization schedule submitted successfully for user {UserId}", userId);

                return Ok(new LoanResponse
                {
                    Message = "Loan Application and Amortization Schedule saved successfully"
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized loan submission attempt.");
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while submitting the loan.");
                return StatusCode(500, "An error occurred while submitting the loan.");
            }
        }


        [HttpGet("{userLoanNumber}")]
        public async Task<IActionResult> GetLoanDetails(int userLoanNumber)
        {
            var userId = GetUserIdFromToken();
            _logger.LogInformation("Fetching loan details for user {UserId} and loan number {UserLoanNumber}", userId, userLoanNumber);

            var loan = await _loanRepository.GetLoanByUserLoanNumberAsync(userLoanNumber, userId);
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

            var loans = await _loanRepository.GetAllLoansAsync(userId);
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
