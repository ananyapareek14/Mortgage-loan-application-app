namespace MortgageAPI.Models.DTO
{
    public class AffordabilityCalculationRequest
    {
        public decimal AnnualIncome { get; set; }
        public decimal DownPayment { get; set; }

        // Defaults applied in backend logic if values are zero or missing
        public int LoanTermMonths { get; set; } = 0; // Set in logic if 0
        public decimal InterestRate { get; set; } = 0; // Set in logic if 0
        public decimal MonthlyDebts { get; set; }

        public decimal DesiredDTIPercentage { get; set; } = 0; // Set in logic if 0
    }


    public class AffordabilityCalculationResult
    {
        public decimal MaxAffordableHomePrice { get; set; }
        public decimal EstimatedLoanAmount { get; set; }
        public decimal EstimatedMonthlyPayment { get; set; }
        public decimal DtiPercentage { get; set; }
        public decimal AnnualIncome { get; set; }
        public decimal DownPayment { get; set; }
        public int LoanTermMonths { get; set; }
        public decimal InterestRate { get; set; }
        public decimal MonthlyDebts { get; set; }
    }
}