namespace MortgageAPI.Models.DTO
{
    public class RefinanceCalculationRequest
    {
        public decimal CurrentLoanAmount { get; set; }
        public decimal InterestRate { get; set; }
        public int CurrentTermMonths { get; set; }
        public int OriginationYear { get; set; }

        public decimal NewLoanAmount { get; set; }
        public decimal NewInterestRate { get; set; }
        public int NewTermMonths { get; set; }

        public decimal RefinanceFees { get; set; }
    }

    public class RefinanceCalculationResult
    {
        public decimal MonthlySavings { get; set; }
        public decimal NewPayment { get; set; }
        public int BreakEvenMonths { get; set; }
        public decimal LifetimeSavings { get; set; }
    }
}
