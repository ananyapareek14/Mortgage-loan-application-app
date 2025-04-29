using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MortgageAPI.Controllers;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;
using Moq;
using NUnit.Framework;

namespace MortgageAPI.Tests.Controllers
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
            var rates = new List<object> { new object(), new object() };
            var rateDtos = new List<InterestRateDto> { new InterestRateDto(), new InterestRateDto() };

            _mockRepository.Setup(repo => repo.GetAllInterestRatesAsync()).ReturnsAsync(rates);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<InterestRateDto>>(rates)).Returns(rateDtos);

            // Act
            var result = await _controller.GetInterestRates();

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.AreEqual(rateDtos, okResult.Value);
            _mockLogger.Verify(logger => logger.LogInformation("Fetching interest rates"), Times.Once);
        }

        [Test]
        public async Task GetInterestRates_ReturnsEmptyList_WhenNoRatesExist()
        {
            // Arrange
            var emptyRates = new List<object>();
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
            Assert.AreEqual(500, objectResult.StatusCode);
            _mockLogger.Verify(logger => logger.LogError(It.IsAny<Exception>(), It.IsAny<string>()), Times.Once);
        }

        [Test]
        public async Task GetInterestRates_HandlesNullMapper_ReturnsInternalServerError()
        {
            // Arrange
            var rates = new List<object> { new object(), new object() };
            _mockRepository.Setup(repo => repo.GetAllInterestRatesAsync()).ReturnsAsync(rates);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<InterestRateDto>>(rates)).Returns((IEnumerable<InterestRateDto>)null);

            // Act
            var result = await _controller.GetInterestRates();

            // Assert
            Assert.IsInstanceOf<ObjectResult>(result);
            var objectResult = result as ObjectResult;
            Assert.AreEqual(500, objectResult.StatusCode);
            _mockLogger.Verify(logger => logger.LogError(It.IsAny<Exception>(), It.IsAny<string>()), Times.Once);
        }

        [Test]
        public async Task GetInterestRates_WithLargeDataSet_ReturnsAllRates()
        {
            // Arrange
            var largeRatesList = new List<object>();
            var largeDtosList = new List<InterestRateDto>();
            for (int i = 0; i < 10000; i++)
            {
                largeRatesList.Add(new object());
                largeDtosList.Add(new InterestRateDto());
            }

            _mockRepository.Setup(repo => repo.GetAllInterestRatesAsync()).ReturnsAsync(largeRatesList);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<InterestRateDto>>(largeRatesList)).Returns(largeDtosList);

            // Act
            var result = await _controller.GetInterestRates();

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.AreEqual(10000, ((IEnumerable<InterestRateDto>)okResult.Value).Count());
        }
    }
}