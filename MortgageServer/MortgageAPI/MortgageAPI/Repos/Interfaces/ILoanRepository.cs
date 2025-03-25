using MortgageAPI.Models.Domain;

namespace MortgageAPI.Repos.Interfaces
{
    public interface ILoanRepository
    {
        Task<Loan> GetLoanByIdAsync(Guid loanId);
        Task<IEnumerable<Loan>> GetAllLoansAsync();
        Task AddLoanAsync(Loan loan);
    }
}
