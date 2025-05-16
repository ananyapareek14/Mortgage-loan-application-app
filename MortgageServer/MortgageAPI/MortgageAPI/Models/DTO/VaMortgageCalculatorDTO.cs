namespace MortgageAPI.Models.DTO
{
    public class VaMortgageScheduleResponse
    {
        public int MonthNumber { get; set; }
        public decimal MonthlyPayment { get; set; }
        public decimal PrincipalPayment { get; set; }
        public decimal InterestPayment { get; set; }
        public decimal RemainingBalance { get; set; }
    }

    public class VaMortgageCalculationRequest
    {
        public decimal HomePrice { get; set; }
        public decimal DownPayment { get; set; }
        public decimal InterestRate { get; set; } // Annual % (e.g., 6.5)
        public int LoanTermYears { get; set; }
    }
}
