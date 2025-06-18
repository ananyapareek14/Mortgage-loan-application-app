using MortgageAPI.Models.Domain;

namespace MortgageAPI.Repos.Helper.Interface
{
    public interface IAmortizationCalculator
    {
        List<AmortizationSchedule> GenerateSchedule(Loan loan);
    }
}
