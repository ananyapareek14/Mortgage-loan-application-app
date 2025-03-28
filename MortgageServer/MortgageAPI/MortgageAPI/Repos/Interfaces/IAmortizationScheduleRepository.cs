using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;

namespace MortgageAPI.Repos.Interfaces
{
    public interface IAmortizationScheduleRepository
    {
        Task<IEnumerable<AmortizationSchedule>> GetScheduleByLoanIdAsync(int loanId);
        Task<List<AmortizationSchedule>> GenerateAmortizationScheduleAsync(LoanRequest loanRequest);
    }
}
