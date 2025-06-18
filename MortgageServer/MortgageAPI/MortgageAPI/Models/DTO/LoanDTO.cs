//namespace MortgageAPI.Models.DTO
//{
//    public class LoanRequest
//    {
//        public decimal LoanAmount { get; set; }
//        public decimal InterestRate { get; set; }
//        public int LoanTermYears { get; set; }
//    }

//    public class LoanDto
//    {
//        public Guid LoanId { get; set; }
//        public int UserLoanNumber { get; set; }
//        public decimal LoanAmount { get; set; }
//        public decimal InterestRate { get; set; }
//        public int LoanTermYears { get; set; }
//        public DateTime ApplicationDate { get; set; }
//        public string ApprovalStatus { get; set; }
//    }

//    public class LoanResponse
//    {
//        public string message { get; set; }
//    }
//}

namespace MortgageAPI.Models.DTO
{
    // Used for creating a new loan
    public class LoanRequest
    {
        public decimal LoanAmount { get; set; }

        // Optional – if not provided, system will look up based on product and date
        public decimal InterestRate { get; set; }

        public int LoanTermYears { get; set; }

        public DateTime ApplicationDate { get; set; }

        // This is the lookup key to match a LoanProduct
        public string ProductCode { get; set; } = string.Empty;

        // Indicates whether to calculate the interest rate from historical data
        public bool CalculateInterestRate { get; set; } = true;
    }

    // Summary of a loan record (e.g. for frontend list or details)
    public class LoanDto
    {
        public Guid LoanId { get; set; }
        public int UserLoanNumber { get; set; }
        public decimal LoanAmount { get; set; }
        public decimal InterestRate { get; set; }
        public int LoanTermYears { get; set; }
        public DateTime ApplicationDate { get; set; }
        public string ApprovalStatus { get; set; }

        public string ProductCode { get; set; }
        public string LoanType { get; set; }  // "Fixed" or "ARM"
    }

    // Optional: Response after creating loan
    public class LoanResponse
    {
        public string Message { get; set; } = string.Empty;
        public Guid LoanId { get; set; }
    }
}
