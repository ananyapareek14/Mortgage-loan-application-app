using MortgageAPI.Models.DTO;

namespace MortgageAPI.Repos.Interfaces
{
    public interface IDTICalculator
    {
        DtiCalculationResult CalculateDti(DtiCalculationRequest request);
    }
}
