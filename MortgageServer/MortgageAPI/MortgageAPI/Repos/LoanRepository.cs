using Microsoft.EntityFrameworkCore;
using MortgageAPI.Data;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos.Helper;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPI.Repos
{
    public class LoanRepository : ILoanRepository
    {
        private readonly AppDbContext _context;
        private readonly IAmortizationCalculator _amortizationCalculator;

        public LoanRepository(AppDbContext context, IAmortizationCalculator amortizationCalculator)
        {
            _context = context;
            _amortizationCalculator = amortizationCalculator;
        }

        public async Task AddLoanAsync(Loan loan)
        {
            int nextUserLoanNumber = await _context.Loans
        .Where(l => l.UserId == loan.UserId)
        .MaxAsync(l => (int?)l.UserLoanNumber) ?? 0;

            loan.UserLoanNumber = nextUserLoanNumber + 1;

            await _context.Loans.AddAsync(loan);
            await _context.SaveChangesAsync();

            var amortizationSchedule = _amortizationCalculator.GenerateSchedule(loan);
            await _context.AmortizationSchedules.AddRangeAsync(amortizationSchedule);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Loan>> GetAllLoansAsync(Guid userId)
        {
            return await _context.Loans
                .Where(l => l.UserId == userId)
                .OrderBy(l => l.UserLoanNumber)
                .ToListAsync();
        }

        public async Task<Loan> GetLoanByUserLoanNumberAsync(int userLoanNumber, Guid userId)
        {
            return await _context.Loans
                .FirstOrDefaultAsync(l => l.UserLoanNumber == userLoanNumber && l.UserId == userId);
        }
    }
}
