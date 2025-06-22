using System.ComponentModel.DataAnnotations;

namespace MortgageAPI.Models.Domain
{
    public enum LoanType
    {
        FixedRate,
        ARM
    }

    public class LoanProduct
    {

        [Key]
        public Guid LoanProductId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        public string ProductCode { get; set; } = string.Empty; // e.g., "30-Year Fixed"

        [Required]
        public LoanType Type { get; set; } // Fixed or ARM

        [Required]
        public int TermYears { get; set; } // e.g., 30, 15, etc.

        public int? FixedRatePeriodYears { get; set; } // for ARM: 5 in 5/1 ARM, 5/6 ARM

        public int? AdjustmentFrequencyMonths { get; set; } // for ARM: 12 for 5/1, 6 for 5/6

        public decimal? InitialRateMargin { get; set; } // For ARM: margin over index

        public string? IndexName { get; set; } // e.g., "SOFR"

        // Navigation
        public ICollection<Loan> Loans { get; set; } = new List<Loan>();
    }
}

