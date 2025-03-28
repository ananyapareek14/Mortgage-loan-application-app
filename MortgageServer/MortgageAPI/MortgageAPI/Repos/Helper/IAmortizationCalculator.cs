using MortgageAPI.Models.Domain;

namespace MortgageAPI.Repos.Helper
{
    public interface IAmortizationCalculator
    {
        List<AmortizationSchedule> GenerateSchedule(Loan loan);
    }
}
