using Microsoft.EntityFrameworkCore;
using MortgageAPI.Data;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPI.Repos
{
    public class LoanRepository : ILoanRepository
    {
        private readonly AppDbContext _context;

        public LoanRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddLoanAsync(Loan loan)
        {
            await _context.Loans.AddAsync(loan);
            await _context.SaveChangesAsync();

            var amortizationSchedule = GenerateAmortizationSchedule(loan);
            await _context.AmortizationSchedules.AddRangeAsync(amortizationSchedule);
            await _context.SaveChangesAsync();
        }

        private List<AmortizationSchedule> GenerateAmortizationSchedule(Loan loan)
        {
            var schedule = new List<AmortizationSchedule>();
            decimal monthlyRate = loan.InterestRate / 100 / 12;
            int months = loan.LoanTermYears * 12;
            decimal monthlyPayment = loan.LoanAmount * (monthlyRate * (decimal)Math.Pow((1 + (double)monthlyRate), months)) /
                                     ((decimal)Math.Pow((1 + (double)monthlyRate), months) - 1);
            decimal balance = loan.LoanAmount;

            for (int i = 1; i <= months; i++)
            {
                decimal interest = Math.Round(balance * monthlyRate, 2);
                decimal principal = Math.Round(monthlyPayment - interest, 2);

                // Ensure the final payment fully clears the balance
                if (i == months)
                {
                    principal = balance;
                    balance = 0;
                }
                else
                {
                    balance = Math.Round(balance - principal, 2);
                }

                schedule.Add(new AmortizationSchedule
                {
                    Id = Guid.NewGuid(),
                    LoanId = loan.LoanId,
                    PaymentNumber = i,
                    PaymentDate = loan.ApplicationDate.AddMonths(i), // Use correct start date
                    PrincipalPayment = principal,
                    InterestPayment = interest,
                    RemainingBalance = balance
                });
            }

            return schedule;
        }

        public async Task<IEnumerable<Loan>> GetAllLoansAsync()
        {
            return await _context.Loans.Include(l => l.User).ToListAsync();
        }

        public async Task<Loan> GetLoanByIdAsync(Guid loanId)
        {
            var loan = await _context.Loans
                .Include(l => l.User)
                .FirstOrDefaultAsync(l => l.LoanId == loanId);

            return loan ?? throw new KeyNotFoundException("Loan not found.");
        }
    }
}
