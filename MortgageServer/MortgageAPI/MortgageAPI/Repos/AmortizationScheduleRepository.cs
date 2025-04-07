using Microsoft.EntityFrameworkCore;
using MortgageAPI.Data;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Helper;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPI.Repos
{
    public class AmortizationScheduleRepository : IAmortizationScheduleRepository
    {
        private readonly AppDbContext _context;
        private readonly IAmortizationCalculator _amortizationCalculator;

        public AmortizationScheduleRepository(AppDbContext context, IAmortizationCalculator amortizationCalculator)
        {
            _context = context;
            _amortizationCalculator = amortizationCalculator;
        }

        //public async Task<IEnumerable<AmortizationSchedule>> GetScheduleByLoanIdAsync(Guid loanId)
        //{
        //    return await _context.AmortizationSchedules
        //    .Where(a => a.LoanId == loanId)
        //    .OrderBy(a => a.PaymentNumber)
        //    .ToListAsync();
        //}
        public async Task<IEnumerable<AmortizationSchedule>> GetScheduleByUserLoanNumberAsync(Guid userId, int userLoanNumber)
        {
            var loan = await _context.Loans
                .FirstOrDefaultAsync(l => l.UserId == userId && l.UserLoanNumber == userLoanNumber);

            if (loan == null)
            {
                throw new KeyNotFoundException("Loan not found.");
            }

            return await _context.AmortizationSchedules
                .Where(a => a.LoanId == loan.LoanId)
                .OrderBy(a => a.PaymentNumber)
                .ToListAsync();
        }


        public async Task<List<AmortizationSchedule>> GenerateAmortizationScheduleAsync(LoanRequest loanRequest)
        {
            var loan = new Loan
            {
                LoanAmount = loanRequest.LoanAmount,
                InterestRate = loanRequest.InterestRate,
                LoanTermYears = loanRequest.LoanTermYears,
                ApplicationDate = DateTime.UtcNow // Temporary date for calculation
            };

            // Use the amortization calculator to generate the schedule
            return await Task.FromResult(_amortizationCalculator.GenerateSchedule(loan));
        }
    }
}
