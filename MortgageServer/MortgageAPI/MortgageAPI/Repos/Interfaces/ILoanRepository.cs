using MortgageAPI.Models.Domain;

namespace MortgageAPI.Repos.Interfaces
{
    public interface ILoanRepository
    {
        Task<Loan> GetLoanByUserLoanNumberAsync(int userLoanNumber, Guid userId);
        Task<IEnumerable<Loan>> GetAllLoansAsync(Guid userId);
        Task AddLoanAsync(Loan loan);
    }
}
