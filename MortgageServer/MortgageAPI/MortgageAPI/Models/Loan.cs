using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MortgageAPI.Models
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
        public Guid LoanId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }  // Foreign key to User

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal LoanAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal InterestRate { get; set; }  // Stored separately for historical accuracy

        [Required]
        public int LoanTermYears { get; set; }

        [Required]
        public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;

        [Required]
        public LoanApprovalStatus ApprovalStatus { get; set; } = LoanApprovalStatus.Pending;

        // Navigation Properties
        [ForeignKey("UserId")]
        public User User { get; set; }

        public ICollection<AmortizationSchedule> AmortizationSchedules { get; set; } = new List<AmortizationSchedule>();
    }
}
