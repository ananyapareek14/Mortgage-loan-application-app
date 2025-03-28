namespace MortgageAPI.Models.DTO
{
    public class LoanRequest
    {
        public decimal LoanAmount { get; set; }
        public decimal InterestRate { get; set; }
        public int LoanTermYears { get; set; }
    }

    public class LoanDto
    {
        public int LoanId { get; set; }
        public decimal LoanAmount { get; set; }
        public decimal InterestRate { get; set; }
        public int LoanTermYears { get; set; }
        public DateTime ApplicationDate { get; set; }
        public string ApprovalStatus { get; set; }
    }
}
