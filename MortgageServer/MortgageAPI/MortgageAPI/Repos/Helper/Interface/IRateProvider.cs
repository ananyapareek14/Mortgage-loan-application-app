using MortgageAPI.Models.Domain;

namespace MortgageAPI.Repos.Helper.Interface
{
    //public interface IRateProvider
    //{
    //    decimal GetInitialRateForFixed(int termYears, DateTime applicationDate);
    //    List<decimal> GetRatesForARM(Loan loan);
    //}

    public interface IRateProvider
    {
        (DateTime date, decimal rate, string term) GetClosestFreddieRate(int termYears, DateTime applicationDate);
        List<(DateTime date, decimal rate)> GetRawSofrRatesUpTo(DateTime applicationDate);
    }
}
