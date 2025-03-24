using System.ComponentModel.DataAnnotations;

namespace MortgageAPI.Models
{
    public class User
    {
        [Key]
        public Guid userId { get; set; } = Guid.NewGuid();
        [Required]
        [MaxLength(100)]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        [Required]
        public string Role {  get; set; } = "User";

        public ICollection<Loan> Loans { get; set; } = new List<Loan>();
    }
}
