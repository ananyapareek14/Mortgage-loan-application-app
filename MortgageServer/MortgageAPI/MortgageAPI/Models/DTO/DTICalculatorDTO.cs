using System.ComponentModel.DataAnnotations.Schema;

namespace MortgageAPI.Models.DTO
{
    public class DtiCalculationRequest
    {
        public decimal AnnualIncome { get; set; }
        public decimal MinCreditCardPayments { get; set; }
        public decimal CarLoanPayments { get; set; }
        public decimal StudentLoanPayments { get; set; }
        public decimal ProposedMonthlyPayment { get; set; }
        public bool CalculateDefaultPayment { get; set; }
    }

    public class DtiCalculationResult
    {
        public decimal DtiPercentage { get; set; }
        public decimal TotalDebts { get; set; }
        public decimal ProposedMonthlyPayment { get; set; }
        public decimal RemainingMonthlyIncome { get; set; }
    }
}