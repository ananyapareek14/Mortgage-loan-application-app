using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using MortgageAPI.Controllers;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPITest.Controllers
{
    [TestFixture]
    public class InterestRateControllerTests
    {
        private Mock<IInterestRateRepository> _mockInterestRateRepository;
        private Mock<IMapper> _mockMapper;
        private Mock<ILogger<InterestRateController>> _mockLogger;
        private InterestRateController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockInterestRateRepository = new Mock<IInterestRateRepository>();
            _mockMapper = new Mock<IMapper>();
            _mockLogger = new Mock<ILogger<InterestRateController>>();
            _controller = new InterestRateController(_mockInterestRateRepository.Object, _mockMapper.Object, _mockLogger.Object);
        }

        [Test]
        public async Task GetInterestRates_ShouldReturnOkResult_WithCompleteInterestRateDtos()
        {
            // Arrange
            var id1 = Guid.NewGuid();
            var id2 = Guid.NewGuid();
            var validFrom1 = new DateTime(2024, 01, 01);
            var validFrom2 = new DateTime(2024, 06, 01);

            var interestRates = new List<InterestRate>
    {
        new InterestRate { Id = id1, Rate = 5.5m, ValidFrom = validFrom1 },
        new InterestRate { Id = id2, Rate = 6.0m, ValidFrom = validFrom2 }
    };

            var interestRateDtos = new List<InterestRateDto>
    {
        new InterestRateDto { Id = id1, Rate = 5.5m, ValidFrom = validFrom1 },
        new InterestRateDto { Id = id2, Rate = 6.0m, ValidFrom = validFrom2 }
    };

            _mockInterestRateRepository
                .Setup(repo => repo.GetAllInterestRatesAsync())
                .ReturnsAsync(interestRates);

            _mockMapper
                .Setup(m => m.Map<IEnumerable<InterestRateDto>>(interestRates))
                .Returns(interestRateDtos);

            // Act
            var result = await _controller.GetInterestRates();

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);

            var returnedRates = okResult.Value as IEnumerable<InterestRateDto>;
            Assert.IsNotNull(returnedRates);

            var rateList = returnedRates.ToList();
            Assert.AreEqual(2, rateList.Count);

            Assert.AreEqual(id1, rateList[0].Id);
            Assert.AreEqual(5.5m, rateList[0].Rate);
            Assert.AreEqual(validFrom1, rateList[0].ValidFrom);

            Assert.AreEqual(id2, rateList[1].Id);
            Assert.AreEqual(6.0m, rateList[1].Rate);
            Assert.AreEqual(validFrom2, rateList[1].ValidFrom);
        }

    }
}
