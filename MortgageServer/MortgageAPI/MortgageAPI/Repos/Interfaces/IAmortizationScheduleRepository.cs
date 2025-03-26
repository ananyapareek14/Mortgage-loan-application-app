using MortgageAPI.Models.Domain;

namespace MortgageAPI.Repos.Interfaces
{
    public interface IAmortizationScheduleRepository
    {
        Task<IEnumerable<AmortizationSchedule>> GetScheduleByLoanIdAsync(Guid loanId);
    }
}
