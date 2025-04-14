using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
        public async Task GetInterestRates_ShouldReturnOkResult_WithInterestRates()
        {
            // Arrange
            var interestRates = new List<InterestRate>
            {
                new InterestRate { Id = Guid.NewGuid(), Rate = 5.5m },
                new InterestRate { Id = Guid.NewGuid(), Rate = 6.0m }
            };

            var interestRateDtos = new List<InterestRateDto>
            {
                new InterestRateDto { Rate = 5.5m },
                new InterestRateDto { Rate = 6.0m }
            };

            _mockInterestRateRepository
                .Setup(repo => repo.GetAllInterestRatesAsync())
                .ReturnsAsync(interestRates);

            _mockMapper
                .Setup(m => m.Map<IEnumerable<InterestRateDto>>(It.IsAny<IEnumerable<InterestRate>>()))
                .Returns(interestRateDtos);

            // Act
            var result = await _controller.GetInterestRates();

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);

            var returnedRates = okResult.Value as IEnumerable<InterestRateDto>;
            Assert.IsNotNull(returnedRates);
            Assert.AreEqual(2, returnedRates.Count());
            Assert.AreEqual(5.5m, returnedRates.First().Rate);
        }
    }
}
