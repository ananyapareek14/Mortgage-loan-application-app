using Microsoft.EntityFrameworkCore;
using MortgageAPI.Data;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos;

namespace MortgageAPITest.Repos
{
    [TestFixture]
    public class InterestRateRepositoryTests
    {
        private AppDbContext _context;
        private InterestRateRepository _repository;

        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _repository = new InterestRateRepository(_context);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task GetAllInterestRatesAsync_ReturnsOrderedRates()
        {
            // Arrange
            var rates = new List<InterestRate>
            {
                new InterestRate { Id = Guid.NewGuid(), Rate = 5.5m },
                new InterestRate { Id = Guid.NewGuid(), Rate = 3.2m },
                new InterestRate { Id = Guid.NewGuid(), Rate = 4.8m }
            };

            _context.InterestRates.AddRange(rates);
            await _context.SaveChangesAsync();

            // Act
            var result = (await _repository.GetAllInterestRatesAsync()).ToList();

            // Assert
            Assert.AreEqual(3, result.Count);
            Assert.AreEqual(3.2m, result[0].Rate); // Should be ordered ascending
            Assert.AreEqual(4.8m, result[1].Rate);
            Assert.AreEqual(5.5m, result[2].Rate);
        }

        [Test]
        public async Task GetAllInterestRatesAsync_WhenEmpty_ReturnsEmptyList()
        {
            // Act
            var result = await _repository.GetAllInterestRatesAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsEmpty(result);
        }
    }
}
