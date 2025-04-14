using Microsoft.EntityFrameworkCore;
using Moq;
using MortgageAPI.Data;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos;
using MortgageAPI.Repos.Helper;

namespace MortgageAPITest.Repos
{
    [TestFixture]
    public class LoanRepositoryTests
    {
        private AppDbContext _context;
        private LoanRepository _repository;
        private Mock<IAmortizationCalculator> _amortizationCalculator;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _amortizationCalculator = new Mock<IAmortizationCalculator>();

            _repository = new LoanRepository(_context, _amortizationCalculator.Object);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task AddLoanAsync_ShouldAddLoanAndGenerateAmortization()
        {
            var userId = Guid.NewGuid();
            var loan = new Loan
            {
                UserId = userId,
                LoanAmount = 100000,
                InterestRate = 5,
                LoanTermYears = 10
            };

            var mockSchedule = new List<AmortizationSchedule>
    {
        new AmortizationSchedule
        {
            LoanId = loan.LoanId,
            PaymentNumber = 1,
            PaymentDate = DateTime.UtcNow.AddMonths(1),
            MonthlyPayment = 1060,
            PrincipalPayment = 800,
            InterestPayment = 260,
            RemainingBalance = 99240
        }
    };

            _amortizationCalculator
                .Setup(x => x.GenerateSchedule(It.IsAny<Loan>()))
                .Returns(mockSchedule);

            await _repository.AddLoanAsync(loan);

            var result = await _context.Loans.FirstOrDefaultAsync();
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.UserLoanNumber);

            var amortizations = await _context.AmortizationSchedules.ToListAsync();
            Assert.AreEqual(1, amortizations.Count);
            Assert.AreEqual(1, amortizations[0].PaymentNumber);
            Assert.AreEqual(1060, amortizations[0].MonthlyPayment);
        }

        [Test]
        public async Task GetLoanByUserLoanNumberAsync_ShouldReturnCorrectLoan()
        {
            var userId = Guid.NewGuid();
            var loan = new Loan
            {
                UserId = userId,
                UserLoanNumber = 1,
                LoanAmount = 50000,
                InterestRate = 4,
                LoanTermYears = 5
            };

            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();

            var result = await _repository.GetLoanByUserLoanNumberAsync(1, userId);

            Assert.IsNotNull(result);
            Assert.AreEqual(loan.LoanAmount, result.LoanAmount);
        }

        [Test]
        public async Task GetAllLoansAsync_ShouldReturnUserLoans()
        {
            var userId = Guid.NewGuid();
            _context.Loans.AddRange(
                new Loan { UserId = userId, UserLoanNumber = 1, LoanAmount = 10000, InterestRate = 3, LoanTermYears = 2 },
                new Loan { UserId = userId, UserLoanNumber = 2, LoanAmount = 15000, InterestRate = 4, LoanTermYears = 3 }
            );
            await _context.SaveChangesAsync();

            var loans = await _repository.GetAllLoansAsync(userId);

            Assert.AreEqual(2, loans.Count());
        }
    }
}
