//using Microsoft.EntityFrameworkCore;
//using Moq;
//using MortgageAPI.Data;
//using MortgageAPI.Models.Domain;
//using MortgageAPI.Repos;

//namespace MortgageAPITest.Repos
//{
//    [TestFixture]
//    public class InterestRateRepositoryTests
//    {
//        private AppDbContext _context;
//        private InterestRateRepository _repository;

//        [SetUp]
//        public void SetUp()
//        {
//            var options = new DbContextOptionsBuilder<AppDbContext>()
//                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Unique per test
//                .Options;

//            _context = new AppDbContext(options);
//            _repository = new InterestRateRepository(_context);
//        }

//        [TearDown]
//        public void TearDown()
//        {
//            _context.Database.EnsureDeleted();
//            _context.Dispose();
//        }

//        [Test]
//        public async Task GetAllInterestRatesAsync_ReturnsOrderedRates_WhenRatesExist()
//        {
//            // Arrange
//            _context.InterestRates.AddRange(
//                new InterestRate { Id = Guid.NewGuid(), Rate = 3.5m },
//                new InterestRate { Id = Guid.NewGuid(), Rate = 2.75m },
//                new InterestRate { Id = Guid.NewGuid(), Rate = 4.0m }
//            );
//            await _context.SaveChangesAsync();

//            // Act
//            var result = await _repository.GetAllInterestRatesAsync();

//            // Assert
//            Assert.That(result, Is.Not.Null);
//            Assert.That(result.Count(), Is.EqualTo(3));
//            Assert.That(result.First().Rate, Is.EqualTo(2.75m));
//            Assert.That(result.Last().Rate, Is.EqualTo(4.0m));
//        }

//        [Test]
//        public async Task GetAllInterestRatesAsync_ReturnsEmptyList_WhenNoRatesExist()
//        {
//            // Act
//            var result = await _repository.GetAllInterestRatesAsync();

//            // Assert
//            Assert.That(result, Is.Not.Null);
//            Assert.That(result, Is.Empty);
//        }

//        [Test]
//        public void GetAllInterestRatesAsync_ThrowsException_WhenDbContextIsNull()
//        {
//            // Arrange
//            _repository = new InterestRateRepository(null);

//            // Act & Assert
//            Assert.ThrowsAsync<NullReferenceException>(() => _repository.GetAllInterestRatesAsync());
//        }
//    }

//}