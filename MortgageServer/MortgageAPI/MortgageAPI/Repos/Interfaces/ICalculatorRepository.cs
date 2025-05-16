using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;

namespace MortgageAPI.Repos.Interfaces
{
    public interface ICalculatorRepository
    {
        AffordabilityCalculationResult CalculateAffordability(AffordabilityCalculationRequest request);
        DtiCalculationResult CalculateDti(DtiCalculationRequest request);
        RefinanceCalculationResult CalculateRefinance(RefinanceCalculationRequest request);
        List<VaMortgageScheduleResponse> CalculateSchedule(VaMortgageCalculationRequest request);
        Task<List<AmortizationSchedule>> GenerateAmortizationScheduleAsync(LoanRequest loanRequest);
    }
}
