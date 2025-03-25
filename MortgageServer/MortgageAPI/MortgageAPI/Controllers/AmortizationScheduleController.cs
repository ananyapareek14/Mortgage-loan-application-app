using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPI.Controllers
{
    [Route("api/amortization")]
    [ApiController]
    public class AmortizationController : ControllerBase
    {
        private readonly IAmortizationScheduleRepository _amortizationRepository;
        private readonly IMapper _mapper;

        public AmortizationController(IAmortizationScheduleRepository amortizationRepository, IMapper mapper)
        {
            _amortizationRepository = amortizationRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> GenerateAmortizationSchedule([FromBody] LoanRequest request)
        {
            var schedule = new List<AmortizationSchedule>();
            decimal monthlyRate = request.InterestRate / 100 / 12;
            int months = request.LoanTermYears * 12;
            decimal monthlyPayment = request.LoanAmount * (monthlyRate * (decimal)Math.Pow((1 + (double)monthlyRate), months)) /
                                     ((decimal)Math.Pow((1 + (double)monthlyRate), months) - 1);
            decimal balance = request.LoanAmount;

            for (int i = 1; i <= months; i++)
            {
                decimal interest = balance * monthlyRate;
                decimal principal = monthlyPayment - interest;
                balance -= principal;

                schedule.Add(new AmortizationSchedule
                {
                    Id = Guid.NewGuid(),
                    PaymentNumber = i,
                    PaymentDate = DateTime.UtcNow.AddMonths(i),
                    PrincipalPayment = principal,
                    InterestPayment = interest,
                    RemainingBalance = balance
                });
            }

            await _amortizationRepository.AddAmortizationScheduleAsync(schedule);
            return Ok("Amortization schedule generated.");
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
