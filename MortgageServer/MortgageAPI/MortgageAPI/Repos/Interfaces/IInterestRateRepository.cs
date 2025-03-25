using MortgageAPI.Models.Domain;

namespace MortgageAPI.Repos.Interfaces
{
    public interface IInterestRateRepository
    {
        Task<IEnumerable<InterestRate>> GetAllInterestRatesAsync();
    }
}
