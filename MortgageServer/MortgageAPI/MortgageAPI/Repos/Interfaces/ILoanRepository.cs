using MortgageAPI.Models.Domain;

namespace MortgageAPI.Repos.Interfaces
{
    public interface ILoanRepository
    {
        Task<Loan> GetLoanByIdAsync(int loanId);
        Task<IEnumerable<Loan>> GetAllLoansAsync();
        Task AddLoanAsync(Loan loan);
    }
}
