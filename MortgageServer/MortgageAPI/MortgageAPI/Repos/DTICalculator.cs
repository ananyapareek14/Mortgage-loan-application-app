using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPI.Repos
{
    public class DTICalculator : IDTICalculator
    {
        public DtiCalculationResult CalculateDti(DtiCalculationRequest request)
        {
            if (request.AnnualIncome <= 0)
                throw new ArgumentException("Annual income must be greater than zero.");

            decimal monthlyIncome = request.AnnualIncome / 12;

            decimal totalDebts = request.MinCreditCardPayments +
                                 request.CarLoanPayments +
                                 request.StudentLoanPayments;

            // Use default mortgage payment for 36% DTI if not provided or flagged
            decimal proposedMonthlyPayment;

            if (request.CalculateDefaultPayment || request.ProposedMonthlyPayment <= 0)
            {
                proposedMonthlyPayment = monthlyIncome * 0.36m;
            }
            else
            {
                proposedMonthlyPayment = request.ProposedMonthlyPayment;
            }

            var result = new DtiCalculationResult
            {
                DtiPercentage = Math.Round((proposedMonthlyPayment / monthlyIncome) * 100, 2),
                TotalDebts = Math.Round(totalDebts, 2),
                ProposedMonthlyPayment = Math.Round(proposedMonthlyPayment, 2),
                RemainingMonthlyIncome = Math.Round(monthlyIncome - (totalDebts + proposedMonthlyPayment), 2)
            };
            return result;
        }
    }
}