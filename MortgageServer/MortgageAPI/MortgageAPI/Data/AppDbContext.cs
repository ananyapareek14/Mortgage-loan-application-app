using Microsoft.EntityFrameworkCore;
using MortgageAPI.Models;

namespace MortgageAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<InterestRate> InterestRates { get; set; }
        public DbSet<AmortizationSchedule> AmortizationSchedules { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // One-to-Many: User -> Loans
            modelBuilder.Entity<Loan>()
                .HasOne(l => l.User)
                .WithMany(u => u.Loans)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Loan -> AmortizationSchedules
            modelBuilder.Entity<AmortizationSchedule>()
                .HasOne(a => a.Loan)
                .WithMany(l => l.AmortizationSchedules)
                .HasForeignKey(a => a.LoanId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
