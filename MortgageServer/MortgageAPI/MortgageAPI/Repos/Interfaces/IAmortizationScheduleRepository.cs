using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;

namespace MortgageAPI.Repos.Interfaces
{
    public interface IAmortizationScheduleRepository
    {
        Task<IEnumerable<AmortizationSchedule>> GetScheduleByUserLoanNumberAsync(Guid userId, int userLoanNumber);

    }
}
