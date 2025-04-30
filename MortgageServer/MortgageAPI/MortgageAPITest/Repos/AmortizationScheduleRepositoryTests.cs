using NUnit.Framework;
using Moq;
using Microsoft.EntityFrameworkCore;
using MortgageAPI.Data;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Helper;
using MortgageAPI.Repos.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MortgageAPI.Repos;

namespace MortgageAPITest.Repos
{
    [TestFixture]
    public class AmortizationScheduleRepositoryTests
    {
        private Mock<AppDbContext> _mockContext;
        private Mock<IAmortizationCalculator> _mockCalculator;
        private AmortizationScheduleRepository _repository;

        [SetUp]
        public void Setup()
        {
            _mockContext = new Mock<AppDbContext>();
            _mockCalculator = new Mock<IAmortizationCalculator>();
            _repository = new AmortizationScheduleRepository(_mockContext.Object, _mockCalculator.Object);
        }

        [Test]
        public async Task GetScheduleByUserLoanNumberAsync_ValidInput_ReturnsSchedule()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userLoanNumber = 1;
            var loanId = Guid.NewGuid();
            var loan = new Loan { LoanId = loanId, UserId = userId, UserLoanNumber = userLoanNumber };
            var schedules = new List<AmortizationSchedule>
            {
                new AmortizationSchedule { LoanId = loanId, PaymentNumber = 1 },
                new AmortizationSchedule { LoanId = loanId, PaymentNumber = 2 }
            };

            var mockLoans = new Mock<DbSet<Loan>>();
            mockLoans.As<IQueryable<Loan>>().Setup(m => m.Provider).Returns(new List<Loan> { loan }.AsQueryable().Provider);
            mockLoans.As<IQueryable<Loan>>().Setup(m => m.Expression).Returns(new List<Loan> { loan }.AsQueryable().Expression);
            mockLoans.As<IQueryable<Loan>>().Setup(m => m.ElementType).Returns(new List<Loan> { loan }.AsQueryable().ElementType);
            mockLoans.As<IQueryable<Loan>>().Setup(m => m.GetEnumerator()).Returns(new List<Loan> { loan }.AsQueryable().GetEnumerator());

            var mockSchedules = new Mock<DbSet<AmortizationSchedule>>();
            mockSchedules.As<IQueryable<AmortizationSchedule>>().Setup(m => m.Provider).Returns(schedules.AsQueryable().Provider);
            mockSchedules.As<IQueryable<AmortizationSchedule>>().Setup(m => m.Expression).Returns(schedules.AsQueryable().Expression);
            mockSchedules.As<IQueryable<AmortizationSchedule>>().Setup(m => m.ElementType).Returns(schedules.AsQueryable().ElementType);
            mockSchedules.As<IQueryable<AmortizationSchedule>>().Setup(m => m.GetEnumerator()).Returns(schedules.AsQueryable().GetEnumerator());

            _mockContext.Setup(c => c.Loans).Returns(mockLoans.Object);
            _mockContext.Setup(c => c.AmortizationSchedules).Returns(mockSchedules.Object);

            // Act
            var result = await _repository.GetScheduleByUserLoanNumberAsync(userId, userLoanNumber);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count());
            Assert.AreEqual(1, result.First().PaymentNumber);
            Assert.AreEqual(2, result.Last().PaymentNumber);
        }

        [Test]
        public void GetScheduleByUserLoanNumberAsync_LoanNotFound_ThrowsKeyNotFoundException()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userLoanNumber = 1;

            var mockLoans = new Mock<DbSet<Loan>>();
            mockLoans.As<IQueryable<Loan>>().Setup(m => m.Provider).Returns(new List<Loan>().AsQueryable().Provider);
            mockLoans.As<IQueryable<Loan>>().Setup(m => m.Expression).Returns(new List<Loan>().AsQueryable().Expression);
            mockLoans.As<IQueryable<Loan>>().Setup(m => m.ElementType).Returns(new List<Loan>().AsQueryable().ElementType);
            mockLoans.As<IQueryable<Loan>>().Setup(m => m.GetEnumerator()).Returns(new List<Loan>().AsQueryable().GetEnumerator());

            _mockContext.Setup(c => c.Loans).Returns(mockLoans.Object);

            // Act & Assert
            Assert.ThrowsAsync<KeyNotFoundException>(async () =>
                await _repository.GetScheduleByUserLoanNumberAsync(userId, userLoanNumber));
        }

        [Test]
        public async Task GenerateAmortizationScheduleAsync_ValidInput_ReturnsGeneratedSchedule()
        {
            // Arrange
            var loanRequest = new LoanRequest
            {
                LoanAmount = 100000,
                InterestRate = 5,
                LoanTermYears = 30
            };

            var expectedSchedule = new List<AmortizationSchedule>
            {
                new AmortizationSchedule { PaymentNumber = 1 },
                new AmortizationSchedule { PaymentNumber = 2 }
            };

            _mockCalculator.Setup(c => c.GenerateSchedule(It.IsAny<Loan>())).Returns(expectedSchedule);

            // Act
            var result = await _repository.GenerateAmortizationScheduleAsync(loanRequest);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
            Assert.AreEqual(1, result[0].PaymentNumber);
            Assert.AreEqual(2, result[1].PaymentNumber);
        }

        [Test]
        public async Task GenerateAmortizationScheduleAsync_ZeroLoanAmount_ReturnsEmptySchedule()
        {
            // Arrange
            var loanRequest = new LoanRequest
            {
                LoanAmount = 0,
                InterestRate = 5,
                LoanTermYears = 30
            };

            _mockCalculator.Setup(c => c.GenerateSchedule(It.IsAny<Loan>())).Returns(new List<AmortizationSchedule>());

            // Act
            var result = await _repository.GenerateAmortizationScheduleAsync(loanRequest);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsEmpty(result);
        }

        [Test]
        public async Task GenerateAmortizationScheduleAsync_NegativeLoanAmount_ReturnsEmptySchedule()
        {
            // Arrange
            var loanRequest = new LoanRequest
            {
                LoanAmount = -100000,
                InterestRate = 5,
                LoanTermYears = 30
            };

            _mockCalculator.Setup(c => c.GenerateSchedule(It.IsAny<Loan>())).Returns(new List<AmortizationSchedule>());

            // Act
            var result = await _repository.GenerateAmortizationScheduleAsync(loanRequest);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsEmpty(result);
        }

        [Test]
        public async Task GenerateAmortizationScheduleAsync_ZeroInterestRate_ReturnsValidSchedule()
        {
            // Arrange
            var loanRequest = new LoanRequest
            {
                LoanAmount = 100000,
                InterestRate = 0,
                LoanTermYears = 30
            };

            var expectedSchedule = new List<AmortizationSchedule>
            {
                new AmortizationSchedule { PaymentNumber = 1 },
                new AmortizationSchedule { PaymentNumber = 2 }
            };

            _mockCalculator.Setup(c => c.GenerateSchedule(It.IsAny<Loan>())).Returns(expectedSchedule);

            // Act
            var result = await _repository.GenerateAmortizationScheduleAsync(loanRequest);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
        }

        [Test]
        public async Task GenerateAmortizationScheduleAsync_MaximumValues_ReturnsValidSchedule()
        {
            // Arrange
            var loanRequest = new LoanRequest
            {
                LoanAmount = decimal.MaxValue,
                InterestRate = 100,
                LoanTermYears = int.MaxValue
            };

            var expectedSchedule = new List<AmortizationSchedule>
            {
                new AmortizationSchedule { PaymentNumber = 1 },
                new AmortizationSchedule { PaymentNumber = 2 }
            };

            _mockCalculator.Setup(c => c.GenerateSchedule(It.IsAny<Loan>())).Returns(expectedSchedule);

            // Act
            var result = await _repository.GenerateAmortizationScheduleAsync(loanRequest);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
        }
    }
}
