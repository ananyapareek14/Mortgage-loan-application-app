using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MortgageAPI.Models
{
    public class InterestRate
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal Rate { get; set; }

        [Required]
        public DateTime ValidFrom { get; set; }
    }
}
