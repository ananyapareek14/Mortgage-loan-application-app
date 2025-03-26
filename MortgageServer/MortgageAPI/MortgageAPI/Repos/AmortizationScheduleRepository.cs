using Microsoft.EntityFrameworkCore;
using MortgageAPI.Data;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPI.Repos
{
    public class AmortizationScheduleRepository : IAmortizationScheduleRepository
    {
        private readonly AppDbContext _context;

        public AmortizationScheduleRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AmortizationSchedule>> GetScheduleByLoanIdAsync(Guid loanId)
        {
            return await _context.AmortizationSchedules
            .Where(a => a.LoanId == loanId)
            .OrderBy(a => a.PaymentNumber)
            .ToListAsync();
        }
    }
}
