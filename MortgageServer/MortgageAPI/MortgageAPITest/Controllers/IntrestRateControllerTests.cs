//using AutoMapper;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Extensions.Logging;
//using MortgageAPI.Controllers;
//using MortgageAPI.Models.DTO;
//using MortgageAPI.Repos.Interfaces;
//using Moq;
//using Microsoft.EntityFrameworkCore;
//using MortgageAPI.Models.Domain;

//namespace MortgageAPITest.Controllers
//{
//    [TestFixture]
//    public class InterestRateControllerTests
//    {
//        private Mock<IInterestRateRepository> _mockRepository;
//        private Mock<IMapper> _mockMapper;
//        private Mock<ILogger<InterestRateController>> _mockLogger;
//        private InterestRateController _controller;

//        [SetUp]
//        public void Setup()
//        {
//            _mockRepository = new Mock<IInterestRateRepository>();
//            _mockMapper = new Mock<IMapper>();
//            _mockLogger = new Mock<ILogger<InterestRateController>>();
//            _controller = new InterestRateController(_mockRepository.Object, _mockMapper.Object, _mockLogger.Object);
//        }

//        [Test]
//        public async Task GetInterestRates_ReturnsOkResult_WithMappedDtos()
//        {
//            // Arrange
//            var rates = new List<object> { new object(), new object() }; // Replace with actual rate objects
//            var rateDtos = new List<InterestRateDto> { new InterestRateDto(), new InterestRateDto() };

//            _mockRepository.Setup(repo => repo.GetAllInterestRatesAsync()).ReturnsAsync(rates);
//            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<InterestRateDto>>(rates)).Returns(rateDtos);

//            // Act
//            var result = await _controller.GetInterestRates();

//            // Assert
//            Assert.IsInstanceOf<OkObjectResult>(result);
//            var okResult = result as OkObjectResult;
//            Assert.AreEqual(rateDtos, okResult.Value);
//            _mockLogger.Verify(logger => logger.LogInformation("Fetching interest rates"), Times.Once);
//        }

//        [Test]
//        public async Task GetInterestRates_ReturnsOkResult_WithEmptyList_WhenNoRatesExist()
//        {
//            // Arrange
//            var emptyRates = new List<object>();
//            var emptyDtos = new List<InterestRateDto>();

//            _mockRepository.Setup(repo => repo.GetAllInterestRatesAsync()).ReturnsAsync(emptyRates);
//            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<InterestRateDto>>(emptyRates)).Returns(emptyDtos);

//            // Act
//            var result = await _controller.GetInterestRates();

//            // Assert
//            Assert.IsInstanceOf<OkObjectResult>(result);
//            var okResult = result as OkObjectResult;
//            Assert.IsEmpty((IEnumerable<InterestRateDto>)okResult.Value);
//        }

//        [Test]
//        public async Task GetInterestRates_HandlesException_AndReturnsInternalServerError()
//        {
//            // Arrange
//            _mockRepository.Setup(repo => repo.GetAllInterestRatesAsync()).ThrowsAsync(new Exception("Database error"));

//            // Act
//            var result = await _controller.GetInterestRates();

//            // Assert
//            Assert.IsInstanceOf<ObjectResult>(result);
//            var objectResult = result as ObjectResult;
//            Assert.AreEqual(500, objectResult.StatusCode);
//            _mockLogger.Verify(logger => logger.LogError(It.IsAny<Exception>(), It.IsAny<string>()), Times.Once);
//        }

//        [Test]
//        public async Task GetInterestRates_HandlesNullReferenceException_AndReturnsBadRequest()
//        {
//            // Arrange
//            _mockRepository.Setup(repo => repo.GetAllInterestRatesAsync()).ReturnsAsync((IEnumerable<object>)null);

//            // Act
//            var result = await _controller.GetInterestRates();

//            // Assert
//            Assert.IsInstanceOf<BadRequestObjectResult>(result);
//            var badRequestResult = result as BadRequestObjectResult;
//            Assert.AreEqual("No interest rates found", badRequestResult.Value);
//        }

//        [Test]
//        public async Task GetInterestRates_LogsInformation_BeforeFetchingRates()
//        {
//            // Arrange
//            _mockRepository.Setup(repo => repo.GetAllInterestRatesAsync()).ReturnsAsync(new List<object>());

//            // Act
//            await _controller.GetInterestRates();

//            // Assert
//            _mockLogger.Verify(logger => logger.LogInformation("Fetching interest rates"), Times.Once);
//        }
//    }
//}
