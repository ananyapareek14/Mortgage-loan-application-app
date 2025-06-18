//using Microsoft.EntityFrameworkCore;
//using MortgageAPI.Models.Domain;

//namespace MortgageAPI.Data
//{
//    public class AppDbContext : DbContext
//    {
//        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

//        public virtual DbSet<User> Users { get; set; }
//        public DbSet<Loan> Loans { get; set; }
//        //public DbSet<InterestRate> InterestRates { get; set; }
//        public DbSet<AmortizationSchedule> AmortizationSchedules { get; set; }

//        protected override void OnModelCreating(ModelBuilder modelBuilder)
//        {
//            // One-to-Many: User -> Loans
//            modelBuilder.Entity<Loan>()
//                .HasOne(l => l.User)
//                .WithMany(u => u.Loans)
//                .HasForeignKey(l => l.UserId)
//                .OnDelete(DeleteBehavior.Cascade);

//            // One-to-Many: Loan -> AmortizationSchedules
//            modelBuilder.Entity<AmortizationSchedule>()
//                .HasOne(a => a.Loan)
//                .WithMany(l => l.AmortizationSchedules)
//                .HasForeignKey(a => a.LoanId)
//                .OnDelete(DeleteBehavior.Cascade);
//        }
//    }
//}


using Microsoft.EntityFrameworkCore;
using MortgageAPI.Models.Domain;

namespace MortgageAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public virtual DbSet<User> Users { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<LoanProduct> LoanProducts { get; set; }
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

            // One-to-Many: LoanProduct -> Loans
            modelBuilder.Entity<Loan>()
                .HasOne(l => l.LoanProduct)
                .WithMany(p => p.Loans)
                .HasForeignKey(l => l.LoanProductId)
                .OnDelete(DeleteBehavior.Restrict); // Keep product even if loan is deleted
        }
    }
}
