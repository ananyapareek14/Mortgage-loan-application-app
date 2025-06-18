using Microsoft.EntityFrameworkCore;
using MortgageAPI.Data;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Helper.Interface;
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

    }
}