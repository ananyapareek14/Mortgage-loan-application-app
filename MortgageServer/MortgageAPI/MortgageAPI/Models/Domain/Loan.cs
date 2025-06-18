using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using MortgageAPI.Models.Domain;

namespace MortgageAPI.Models.Domain
{
    public enum LoanApprovalStatus
    {
        Pending,
        Approved,
        Rejected
    }

    public class Loan
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid LoanId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public int UserLoanNumber { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal LoanAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal InterestRate { get; set; }

        [Required]
        public int LoanTermYears { get; set; }

        [Required]
        public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;

        [Required]
        public LoanApprovalStatus ApprovalStatus { get; set; } = LoanApprovalStatus.Pending;

        // 🔹 New: Link to LoanProduct
        [Required]
        public Guid LoanProductId { get; set; }

        [ForeignKey("LoanProductId")]
        public LoanProduct LoanProduct { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        public ICollection<AmortizationSchedule> AmortizationSchedules { get; set; } = new List<AmortizationSchedule>();
    }

}
