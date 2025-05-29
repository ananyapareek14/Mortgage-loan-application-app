using NUnit.Framework;
using Microsoft.EntityFrameworkCore;
using MortgageAPI.Data;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Helper;
using MortgageAPI.Repos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Moq;

namespace MortgageAPITest.Repos
{
    [TestFixture]
    public class AmortizationScheduleRepositoryTests
    {
        private AppDbContext _context;
        private Mock<IAmortizationCalculator> _mockCalculator;
        private AmortizationScheduleRepository _repository;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _mockCalculator = new Mock<IAmortizationCalculator>();
            _repository = new AmortizationScheduleRepository(_context, _mockCalculator.Object);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Test]
        public async Task GetScheduleByUserLoanNumberAsync_ValidInput_ReturnsSchedule()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userLoanNumber = 1;
            var loanId = Guid.NewGuid();
            var loan = new Loan { LoanId = loanId, UserId = userId, UserLoanNumber = userLoanNumber };

            _context.Loans.Add(loan);
            _context.AmortizationSchedules.AddRange(
                new AmortizationSchedule { LoanId = loanId, PaymentNumber = 1 },
                new AmortizationSchedule { LoanId = loanId, PaymentNumber = 2 }
            );
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetScheduleByUserLoanNumberAsync(userId, userLoanNumber);

            // Assert
            Assert.IsNotNull(result);
            Assert.That(result.Count(), Is.EqualTo(2));
            Assert.That(result.First().PaymentNumber, Is.EqualTo(1));
            Assert.That(result.Last().PaymentNumber, Is.EqualTo(2));
        }

        [Test]
        public void GetScheduleByUserLoanNumberAsync_LoanNotFound_ThrowsKeyNotFoundException()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userLoanNumber = 1;

            // Act & Assert
            Assert.ThrowsAsync<KeyNotFoundException>(async () =>
                await _repository.GetScheduleByUserLoanNumberAsync(userId, userLoanNumber));
        }

        //[Test]
        //public async Task GenerateAmortizationScheduleAsync_ValidInput_ReturnsGeneratedSchedule()
        //{
        //    var loanRequest = new LoanRequest
        //    {
        //        LoanAmount = 100000,
        //        InterestRate = 5,
        //        LoanTermYears = 30
        //    };

        //    var expectedSchedule = new List<AmortizationSchedule>
        //    {
        //        new AmortizationSchedule { PaymentNumber = 1 },
        //        new AmortizationSchedule { PaymentNumber = 2 }
        //    };

        //    _mockCalculator.Setup(c => c.GenerateSchedule(It.IsAny<Loan>())).Returns(expectedSchedule);

        //    var result = await _repository.GenerateAmortizationScheduleAsync(loanRequest);

        //    Assert.IsNotNull(result);
        //    Assert.AreEqual(2, result.Count);
        //}

        //[Test]
        //public async Task GenerateAmortizationScheduleAsync_ZeroLoanAmount_ReturnsEmptySchedule()
        //{
        //    var loanRequest = new LoanRequest
        //    {
        //        LoanAmount = 0,
        //        InterestRate = 5,
        //        LoanTermYears = 30
        //    };

        //    _mockCalculator.Setup(c => c.GenerateSchedule(It.IsAny<Loan>())).Returns(new List<AmortizationSchedule>());

        //    var result = await _repository.GenerateAmortizationScheduleAsync(loanRequest);

        //    Assert.IsNotNull(result);
        //    Assert.IsEmpty(result);
        //}

        //[Test]
        //public async Task GenerateAmortizationScheduleAsync_NegativeLoanAmount_ReturnsEmptySchedule()
        //{
        //    var loanRequest = new LoanRequest
        //    {
        //        LoanAmount = -100000,
        //        InterestRate = 5,
        //        LoanTermYears = 30
        //    };

        //    _mockCalculator.Setup(c => c.GenerateSchedule(It.IsAny<Loan>())).Returns(new List<AmortizationSchedule>());

        //    var result = await _repository.GenerateAmortizationScheduleAsync(loanRequest);

        //    Assert.IsNotNull(result);
        //    Assert.IsEmpty(result);
        //}

        //[Test]
        //public async Task GenerateAmortizationScheduleAsync_MaxValues_ReturnsSchedule()
        //{
        //    var loanRequest = new LoanRequest
        //    {
        //        LoanAmount = decimal.MaxValue,
        //        InterestRate = 100,
        //        LoanTermYears = int.MaxValue
        //    };

        //    var expectedSchedule = new List<AmortizationSchedule>
        //    {
        //        new AmortizationSchedule { PaymentNumber = 1 },
        //        new AmortizationSchedule { PaymentNumber = 2 }
        //    };

        //    _mockCalculator.Setup(c => c.GenerateSchedule(It.IsAny<Loan>())).Returns(expectedSchedule);

        //    var result = await _repository.GenerateAmortizationScheduleAsync(loanRequest);

        //    Assert.IsNotNull(result);
        //    Assert.AreEqual(2, result.Count);
        //}
    }
}

