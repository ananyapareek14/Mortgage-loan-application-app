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
        private Mock<IInterestRateRepository> _mockRepository;
        private Mock<IMapper> _mockMapper;
        private Mock<ILogger<InterestRateController>> _mockLogger;
        private InterestRateController _controller;

        [SetUp]
        public void Setup()
        {
            _mockRepository = new Mock<IInterestRateRepository>();
            _mockMapper = new Mock<IMapper>();
            _mockLogger = new Mock<ILogger<InterestRateController>>();
            _controller = new InterestRateController(_mockRepository.Object, _mockMapper.Object, _mockLogger.Object);
        }

        [Test]
        public async Task GetInterestRates_ReturnsOkResult_WithMappedDtos()
        {
            // Arrange
            var rates = new List<InterestRate> { new InterestRate(), new InterestRate() };
            var rateDtos = new List<InterestRateDto> { new InterestRateDto(), new InterestRateDto() };

            _mockRepository.Setup(repo => repo.GetAllInterestRatesAsync()).ReturnsAsync(rates);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<InterestRateDto>>(rates)).Returns(rateDtos);

            // Act
            var result = await _controller.GetInterestRates();

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(rateDtos));
            //_mockLogger.Verify(logger => logger.LogInformation("Fetching interest rates"), Times.Once);
            _mockLogger.Verify(
    x => x.Log(
        LogLevel.Information,
        It.IsAny<EventId>(),
        It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("Fetching interest rates")),
        It.IsAny<Exception>(),
        (Func<It.IsAnyType, Exception, string>)It.IsAny<object>()),
    Times.Once);

        }

        [Test]
        public async Task GetInterestRates_ReturnsEmptyList_WhenNoRatesExist()
        {
            // Arrange
            var emptyRates = new List<InterestRate>();
            var emptyDtos = new List<InterestRateDto>();

            _mockRepository.Setup(repo => repo.GetAllInterestRatesAsync()).ReturnsAsync(emptyRates);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<InterestRateDto>>(emptyRates)).Returns(emptyDtos);

            // Act
            var result = await _controller.GetInterestRates();

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsEmpty((IEnumerable<InterestRateDto>)okResult.Value);
        }

        //[Test]
        //public async Task GetInterestRates_HandlesException_ReturnsInternalServerError()
        //{
        //    // Arrange
        //    _mockRepository.Setup(repo => repo.GetAllInterestRatesAsync()).ThrowsAsync(new Exception("Database error"));

        //    // Act
        //    var result = await _controller.GetInterestRates();

        //    // Assert
        //    Assert.IsInstanceOf<ObjectResult>(result);
        //    var objectResult = result as ObjectResult;
        //    Assert.AreEqual(500, objectResult.StatusCode);
        //    _mockLogger.Verify(logger => logger.LogError(It.IsAny<Exception>(), It.IsAny<string>()), Times.Once);
        //}

        [Test]
        public async Task GetInterestRates_HandlesException_ReturnsInternalServerError()
        {
            // Arrange
            _mockRepository.Setup(repo => repo.GetAllInterestRatesAsync()).ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.GetInterestRates();

            // Assert
            Assert.IsInstanceOf<ObjectResult>(result);
            var objectResult = result as ObjectResult;
            Assert.That(objectResult.StatusCode, Is.EqualTo(500));

            // Verify that LogError was called
            _mockLogger.Verify(
    logger => logger.Log(
        LogLevel.Error,
        It.IsAny<EventId>(),
        It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("Error occurred while fetching interest rates")),
        It.IsAny<Exception>(),
        It.IsAny<Func<It.IsAnyType, Exception, string>>()),
    Times.Once);

        }

        [Test]
        public async Task GetInterestRates_HandlesNullMapper_ReturnsInternalServerError()
        {
            // Arrange
            var rates = new List<InterestRate> { new InterestRate(), new InterestRate() };
            _mockRepository.Setup(repo => repo.GetAllInterestRatesAsync()).ReturnsAsync(rates);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<InterestRateDto>>(rates)).Returns((IEnumerable<InterestRateDto>)null);

            // Act
            var result = await _controller.GetInterestRates();

            // Assert
            Assert.IsInstanceOf<ObjectResult>(result);
            var objectResult = result as ObjectResult;
            Assert.That(objectResult.StatusCode, Is.EqualTo(500));
            //_mockLogger.Verify(logger => logger.LogError(It.IsAny<Exception>(), It.IsAny<string>()), Times.Once);
            _mockLogger.Verify(
    logger => logger.Log(
        LogLevel.Error,
        It.IsAny<EventId>(),
        It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("Error occurred while fetching interest rates") || v.ToString().Contains("Mapping result was null")),
        It.IsAny<Exception>(),
        It.IsAny<Func<It.IsAnyType, Exception, string>>()),
    Times.Once);

        }

        [Test]
        public async Task GetInterestRates_WithLargeDataSet_ReturnsAllRates()
        {
            // Arrange
            var largeRatesList = new List<InterestRate>();
            var largeDtosList = new List<InterestRateDto>();
            for (int i = 0; i < 10000; i++)
            {
                largeRatesList.Add(new InterestRate());
                largeDtosList.Add(new InterestRateDto());
            }

            _mockRepository.Setup(repo => repo.GetAllInterestRatesAsync()).ReturnsAsync(largeRatesList);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<InterestRateDto>>(largeRatesList)).Returns(largeDtosList);

            // Act
            var result = await _controller.GetInterestRates();

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.That(((IEnumerable<InterestRateDto>)okResult.Value).Count(), Is.EqualTo(10000));
        }
    }
}
