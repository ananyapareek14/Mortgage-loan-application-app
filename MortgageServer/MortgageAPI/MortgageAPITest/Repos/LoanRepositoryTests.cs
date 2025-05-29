using NUnit.Framework;
using Moq;
using Microsoft.EntityFrameworkCore;
using MortgageAPI.Data;
using MortgageAPI.Models.Domain;
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
    public class LoanRepositoryTests
    {
        private AppDbContext _mockContext;
        private Mock<IAmortizationCalculator> _mockAmortizationCalculator;
        private LoanRepository _loanRepository;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // unique DB per test
                .Options;

            _mockContext = new AppDbContext(options);
            _mockAmortizationCalculator = new Mock<IAmortizationCalculator>();
            _mockAmortizationCalculator
        .Setup(ac => ac.GenerateSchedule(It.IsAny<Loan>()))
        .Returns(new List<AmortizationSchedule>
        {
            new AmortizationSchedule
            {
                PaymentNumber = 1,
                MonthlyPayment = 1000,
                PrincipalPayment = 800,
                InterestPayment = 200,
                RemainingBalance = 9200,
                PaymentDate = DateTime.Today
            }
        });
            _loanRepository = new LoanRepository(_mockContext, _mockAmortizationCalculator.Object);


        }

        [TearDown]
        public void TearDown()
        {
            _mockContext.Dispose();
        }

        [Test]
        public async Task AddLoanAsync_NewLoan_SetsCorrectUserLoanNumber()
        {
            // Arrange
            var userId = Guid.NewGuid();
            await _mockContext.Loans.AddRangeAsync(
                new Loan { UserId = userId, UserLoanNumber = 1 },
                new Loan { UserId = userId, UserLoanNumber = 2 }
            );
            await _mockContext.SaveChangesAsync();

            var newLoan = new Loan { UserId = userId };

            // Act
            await _loanRepository.AddLoanAsync(newLoan);

            // Assert
            Assert.That(newLoan.UserLoanNumber, Is.EqualTo(3));
        }

        [Test]
        public async Task AddLoanAsync_FirstLoanForUser_SetsUserLoanNumberToOne()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var newLoan = new Loan { UserId = userId };

            // Act
            await _loanRepository.AddLoanAsync(newLoan);

            // Assert
            Assert.That(newLoan.UserLoanNumber, Is.EqualTo(1));
        }

        [Test]
        public async Task GetAllLoansAsync_ReturnsCorrectLoans()
        {
            // Arrange
            var userId = Guid.NewGuid();
            await _mockContext.Loans.AddRangeAsync(
                new Loan { UserId = userId, UserLoanNumber = 1 },
                new Loan { UserId = userId, UserLoanNumber = 2 },
                new Loan { UserId = Guid.NewGuid(), UserLoanNumber = 1 } // Different user
            );
            await _mockContext.SaveChangesAsync();

            // Act
            var result = await _loanRepository.GetAllLoansAsync(userId);

            // Assert
            Assert.That(result.Count(), Is.EqualTo(2));
            Assert.IsTrue(result.All(l => l.UserId == userId));
        }

        [Test]
        public async Task GetLoanByUserLoanNumberAsync_ExistingLoan_ReturnsCorrectLoan()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userLoanNumber = 2;

            await _mockContext.Loans.AddRangeAsync(
                new Loan { UserId = userId, UserLoanNumber = 1 },
                new Loan { UserId = userId, UserLoanNumber = 2 },
                new Loan { UserId = Guid.NewGuid(), UserLoanNumber = 2 }
            );
            await _mockContext.SaveChangesAsync();

            // Act
            var result = await _loanRepository.GetLoanByUserLoanNumberAsync(userLoanNumber, userId);

            // Assert
            Assert.IsNotNull(result);
            Assert.That(result.UserId, Is.EqualTo(userId));
            Assert.That(result.UserLoanNumber, Is.EqualTo(userLoanNumber));
        }

        [Test]
        public async Task GetLoanByUserLoanNumberAsync_NonExistingLoan_ReturnsNull()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userLoanNumber = 3;

            await _mockContext.Loans.AddRangeAsync(
                new Loan { UserId = userId, UserLoanNumber = 1 },
                new Loan { UserId = userId, UserLoanNumber = 2 }
            );
            await _mockContext.SaveChangesAsync();

            // Act
            var result = await _loanRepository.GetLoanByUserLoanNumberAsync(userLoanNumber, userId);

            // Assert
            Assert.IsNull(result);
        }
    }
}
