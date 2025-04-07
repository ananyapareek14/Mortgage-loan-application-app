using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;

namespace MortgageAPI.Repos.Interfaces
{
    public interface IAmortizationScheduleRepository
    {
        //Task<IEnumerable<AmortizationSchedule>> GetScheduleByLoanIdAsync(Guid loanId);

        Task<IEnumerable<AmortizationSchedule>> GetScheduleByUserLoanNumberAsync(Guid userId, int userLoanNumber);
        Task<List<AmortizationSchedule>> GenerateAmortizationScheduleAsync(LoanRequest loanRequest);
    }
}
