using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using MortgageAPI.Controllers;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPITest.Controllers
{
    public class AmortizationScheduleControllerTests
    {
        private Mock<IAmortizationScheduleRepository> _repoMock;
        private Mock<IMapper> _mapperMock;
        private Mock<ILogger<AmortizationController>> _loggerMock;
        private AmortizationController _controller;

        [SetUp]
        public void Setup()
        {
            _repoMock = new Mock<IAmortizationScheduleRepository>();
            _mapperMock = new Mock<IMapper>();
            _loggerMock = new Mock<ILogger<AmortizationController>>();

            _controller = new AmortizationController(_repoMock.Object, _mapperMock.Object, _loggerMock.Object);

            var userId = Guid.NewGuid().ToString();
            var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, userId) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var principal = new ClaimsPrincipal(identity);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };
        }

        [Test]
        public async Task CalculateAmortization_ValidRequest_ReturnsOk()
        {
            // Arrange
            var request = new LoanRequest { LoanAmount = 100000, InterestRate = 5.5m, LoanTermYears = 15 };
            var domainList = new List<AmortizationSchedule> { new AmortizationSchedule { PaymentNumber = 1 } };
            var dtoList = new List<AmortizationScheduleDto> { new AmortizationScheduleDto { PaymentNumber = 1 } };

            _repoMock.Setup(r => r.GenerateAmortizationScheduleAsync(request)).ReturnsAsync(domainList);
            _mapperMock.Setup(m => m.Map<IEnumerable<AmortizationScheduleDto>>(domainList)).Returns(dtoList);

            // Act
            var result = await _controller.CalculateAmortization(request) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.AreEqual(dtoList, result.Value);
        }

        [Test]
        public async Task CalculateAmortization_InvalidRequest_ReturnsBadRequest()
        {
            // Arrange
            var request = new LoanRequest { LoanAmount = 0, InterestRate = 0, LoanTermYears = 0 };

            // Act
            var result = await _controller.CalculateAmortization(request) as BadRequestObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public async Task GetSchedule_ScheduleExists_ReturnsOk()
        {
            // Arrange
            var domainList = new List<AmortizationSchedule> { new AmortizationSchedule { PaymentNumber = 1 } };
            var dtoList = new List<AmortizationScheduleDto> { new AmortizationScheduleDto { PaymentNumber = 1 } };

            _repoMock.Setup(r => r.GetScheduleByUserLoanNumberAsync(It.IsAny<Guid>(), 1)).ReturnsAsync(domainList);
            _mapperMock.Setup(m => m.Map<IEnumerable<AmortizationScheduleDto>>(domainList)).Returns(dtoList);

            // Act
            var result = await _controller.GetSchedule(1) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.AreEqual(dtoList, result.Value);
        }

        [Test]
        public async Task GetSchedule_ScheduleNotFound_ReturnsNotFound()
        {
            // Arrange
            _repoMock.Setup(r => r.GetScheduleByUserLoanNumberAsync(It.IsAny<Guid>(), 999))
                .ReturnsAsync(new List<AmortizationSchedule>());

            // Act
            var result = await _controller.GetSchedule(999) as NotFoundObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
            Assert.AreEqual("Schedule not found.", result.Value);
        }
    }
}
