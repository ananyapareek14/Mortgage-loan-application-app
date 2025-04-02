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
                .ToListAsync();
        }

        //public async Task<IEnumerable<Loan>> GetAllLoansAsync()
        //{
        //    return await _context.Loans.Include(l => l.UserId).ToListAsync();
        //}

        //public async Task<Loan> GetLoanByIdAsync(int loanId)
        //{
        //    var loan = await _context.Loans
        //        .Include(l => l.UserId)
        //        .FirstOrDefaultAsync(l => l.LoanId == loanId);

        //    return loan ?? throw new KeyNotFoundException("Loan not found.");
        //}

        public async Task<Loan> GetLoanByIdAsync(int loanId, Guid userId)
        {
            var loan = await _context.Loans
                .FirstOrDefaultAsync(l => l.LoanId == loanId && l.UserId == userId);

            return loan ?? throw new KeyNotFoundException("Loan not found.");
        }
    }
}
