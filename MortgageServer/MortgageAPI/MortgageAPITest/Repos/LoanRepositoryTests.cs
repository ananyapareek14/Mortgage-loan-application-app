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

namespace MortgageAPI.Tests.Repos
{
    [TestFixture]
    public class LoanRepositoryTests
    {
        private Mock<AppDbContext> _mockContext;
        private Mock<IAmortizationCalculator> _mockAmortizationCalculator;
        private LoanRepository _loanRepository;

        [SetUp]
        public void Setup()
        {
            //_mockContext = new Mock<AppDbContext>();
            //_mockAmortizationCalculator = new Mock<IAmortizationCalculator>();
            //_loanRepository = new LoanRepository(_mockContext.Object, _mockAmortizationCalculator.Object);

            var options = new DbContextOptionsBuilder<AppDbContext>()
        .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // unique DB per test
        .Options;

            _mockContext = new AppDbContext(options);
            _mockAmortizationCalculator = new Mock<IAmortizationCalculator>();
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
            var loan = new Loan { UserId = userId };
            var loans = new List<Loan>
            {
                new Loan { UserId = userId, UserLoanNumber = 1 },
                new Loan { UserId = userId, UserLoanNumber = 2 }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<Loan>>();
            mockSet.As<IQueryable<Loan>>().Setup(m => m.Provider).Returns(loans.Provider);
            mockSet.As<IQueryable<Loan>>().Setup(m => m.Expression).Returns(loans.Expression);
            mockSet.As<IQueryable<Loan>>().Setup(m => m.ElementType).Returns(loans.ElementType);
            mockSet.As<IQueryable<Loan>>().Setup(m => m.GetEnumerator()).Returns(loans.GetEnumerator());

            _mockContext.Setup(c => c.Loans).Returns(mockSet.Object);

            // Act
            await _loanRepository.AddLoanAsync(loan);

            // Assert
            Assert.AreEqual(3, loan.UserLoanNumber);
            _mockContext.Verify(c => c.SaveChangesAsync(default), Times.Exactly(2));
        }

        [Test]
        public async Task AddLoanAsync_FirstLoanForUser_SetsUserLoanNumberToOne()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var loan = new Loan { UserId = userId };
            var loans = new List<Loan>().AsQueryable();

            var mockSet = new Mock<DbSet<Loan>>();
            mockSet.As<IQueryable<Loan>>().Setup(m => m.Provider).Returns(loans.Provider);
            mockSet.As<IQueryable<Loan>>().Setup(m => m.Expression).Returns(loans.Expression);
            mockSet.As<IQueryable<Loan>>().Setup(m => m.ElementType).Returns(loans.ElementType);
            mockSet.As<IQueryable<Loan>>().Setup(m => m.GetEnumerator()).Returns(loans.GetEnumerator());

            _mockContext.Setup(c => c.Loans).Returns(mockSet.Object);

            // Act
            await _loanRepository.AddLoanAsync(loan);

            // Assert
            Assert.AreEqual(1, loan.UserLoanNumber);
            _mockContext.Verify(c => c.SaveChangesAsync(default), Times.Exactly(2));
        }

        [Test]
        public async Task GetAllLoansAsync_ReturnsCorrectLoans()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var loans = new List<Loan>
            {
                new Loan { UserId = userId, UserLoanNumber = 1 },
                new Loan { UserId = userId, UserLoanNumber = 2 },
                new Loan { UserId = Guid.NewGuid(), UserLoanNumber = 1 }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<Loan>>();
            mockSet.As<IQueryable<Loan>>().Setup(m => m.Provider).Returns(loans.Provider);
            mockSet.As<IQueryable<Loan>>().Setup(m => m.Expression).Returns(loans.Expression);
            mockSet.As<IQueryable<Loan>>().Setup(m => m.ElementType).Returns(loans.ElementType);
            mockSet.As<IQueryable<Loan>>().Setup(m => m.GetEnumerator()).Returns(loans.GetEnumerator());

            _mockContext.Setup(c => c.Loans).Returns(mockSet.Object);

            // Act
            var result = await _loanRepository.GetAllLoansAsync(userId);

            // Assert
            Assert.AreEqual(2, result.Count());
            Assert.IsTrue(result.All(l => l.UserId == userId));
            Assert.AreEqual(1, result.First().UserLoanNumber);
            Assert.AreEqual(2, result.Last().UserLoanNumber);
        }

        [Test]
        public async Task GetLoanByUserLoanNumberAsync_ExistingLoan_ReturnsCorrectLoan()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userLoanNumber = 2;
            var loans = new List<Loan>
            {
                new Loan { UserId = userId, UserLoanNumber = 1 },
                new Loan { UserId = userId, UserLoanNumber = 2 },
                new Loan { UserId = Guid.NewGuid(), UserLoanNumber = 2 }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<Loan>>();
            mockSet.As<IQueryable<Loan>>().Setup(m => m.Provider).Returns(loans.Provider);
            mockSet.As<IQueryable<Loan>>().Setup(m => m.Expression).Returns(loans.Expression);
            mockSet.As<IQueryable<Loan>>().Setup(m => m.ElementType).Returns(loans.ElementType);
            mockSet.As<IQueryable<Loan>>().Setup(m => m.GetEnumerator()).Returns(loans.GetEnumerator());

            _mockContext.Setup(c => c.Loans).Returns(mockSet.Object);

            // Act
            var result = await _loanRepository.GetLoanByUserLoanNumberAsync(userLoanNumber, userId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(userId, result.UserId);
            Assert.AreEqual(userLoanNumber, result.UserLoanNumber);
        }

        [Test]
        public async Task GetLoanByUserLoanNumberAsync_NonExistingLoan_ReturnsNull()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userLoanNumber = 3;
            var loans = new List<Loan>
            {
                new Loan { UserId = userId, UserLoanNumber = 1 },
                new Loan { UserId = userId, UserLoanNumber = 2 }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<Loan>>();
            mockSet.As<IQueryable<Loan>>().Setup(m => m.Provider).Returns(loans.Provider);
            mockSet.As<IQueryable<Loan>>().Setup(m => m.Expression).Returns(loans.Expression);
            mockSet.As<IQueryable<Loan>>().Setup(m => m.ElementType).Returns(loans.ElementType);
            mockSet.As<IQueryable<Loan>>().Setup(m => m.GetEnumerator()).Returns(loans.GetEnumerator());

            _mockContext.Setup(c => c.Loans).Returns(mockSet.Object);

            // Act
            var result = await _loanRepository.GetLoanByUserLoanNumberAsync(userLoanNumber, userId);

            // Assert
            Assert.IsNull(result);
        }
    }
}