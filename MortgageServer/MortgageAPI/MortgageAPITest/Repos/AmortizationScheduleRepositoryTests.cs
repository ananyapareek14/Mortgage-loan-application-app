using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
using MortgageAPI.Data;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Helper;
using MortgageAPI.Repos;

namespace MortgageAPITest.Repos
{
    public class AmortizationScheduleRepositoryTests
    {
        private AppDbContext _context;
        private Mock<IAmortizationCalculator> _calculatorMock;
        private AmortizationScheduleRepository _repository;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // unique DB per test
                .Options;

            _context = new AppDbContext(options);
            _calculatorMock = new Mock<IAmortizationCalculator>();
            _repository = new AmortizationScheduleRepository(_context, _calculatorMock.Object);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task GenerateAmortizationScheduleAsync_ShouldReturnSchedule()
        {
            // Arrange
            var loanRequest = new LoanRequest
            {
                LoanAmount = 100000,
                InterestRate = 5.5m,
                LoanTermYears = 10
            };

            var expectedSchedule = new List<AmortizationSchedule>
            {
                new AmortizationSchedule { PaymentNumber = 1, MonthlyPayment = 1000 }
            };

            _calculatorMock.Setup(x => x.GenerateSchedule(It.IsAny<Loan>()))
                .Returns(expectedSchedule);

            // Act
            var result = await _repository.GenerateAmortizationScheduleAsync(loanRequest);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
            Assert.AreEqual(1000, result[0].MonthlyPayment);
        }

        [Test]
        public async Task GetScheduleByUserLoanNumberAsync_ShouldReturnSchedule()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var loanId = Guid.NewGuid();
            var loan = new Loan
            {
                LoanId = loanId,
                UserId = userId,
                UserLoanNumber = 1
            };

            _context.Loans.Add(loan);

            var schedule = new AmortizationSchedule
            {
                LoanId = loanId,
                PaymentNumber = 1,
                MonthlyPayment = 1000,
                PrincipalPayment = 800,
                InterestPayment = 200,
                RemainingBalance = 92000,
                PaymentDate = DateTime.UtcNow
            };

            _context.AmortizationSchedules.Add(schedule);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetScheduleByUserLoanNumberAsync(userId, 1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count());
            Assert.AreEqual(1000, result.First().MonthlyPayment);
        }

        [Test]
        public void GetScheduleByUserLoanNumberAsync_ShouldThrowIfLoanNotFound()
        {
            // Arrange
            var userId = Guid.NewGuid();

            // Act & Assert
            var ex = Assert.ThrowsAsync<KeyNotFoundException>(() =>
                _repository.GetScheduleByUserLoanNumberAsync(userId, 999));

            Assert.That(ex.Message, Is.EqualTo("Loan not found."));
        }
    }
}
