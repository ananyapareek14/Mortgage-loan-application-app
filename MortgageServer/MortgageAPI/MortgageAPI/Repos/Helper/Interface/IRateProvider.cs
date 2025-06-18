using MortgageAPI.Models.Domain;

namespace MortgageAPI.Repos.Helper.Interface
{
    public interface IRateProvider
    {
        decimal GetInitialRateForFixed(int termYears, DateTime applicationDate);
        List<decimal> GetRatesForARM(Loan loan);
    }
}
