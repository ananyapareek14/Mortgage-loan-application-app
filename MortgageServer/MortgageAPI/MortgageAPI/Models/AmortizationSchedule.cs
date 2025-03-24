using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MortgageAPI.Models
{
    public class AmortizationSchedule
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid LoanId { get; set; }

        [Required]
        public int PaymentNumber { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrincipalPayment { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal InterestPayment { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal RemainingBalance { get; set; }

        // Navigation Property
        [ForeignKey("LoanId")]
        public Loan Loan { get; set; }
    }
}
