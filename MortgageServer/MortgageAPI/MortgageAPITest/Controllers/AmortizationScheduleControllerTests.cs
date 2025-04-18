using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using MortgageAPI.Controllers;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;
using System.Reflection;
using System.Security.Claims;

namespace MortgageAPI.Tests
{
    [TestFixture]
    public class AmortizationControllerTests
    {
        private Mock<IAmortizationScheduleRepository> _mockRepository;
        private Mock<IMapper> _mockMapper;
        private Mock<ILogger<AmortizationController>> _mockLogger;
        private AmortizationController _controller;

        [SetUp]
        public void Setup()
        {
            _mockRepository = new Mock<IAmortizationScheduleRepository>();
            _mockMapper = new Mock<IMapper>();
            _mockLogger = new Mock<ILogger<AmortizationController>>();
            _controller = new AmortizationController(_mockRepository.Object, _mockMapper.Object, _mockLogger.Object);
        }

        [Test]
        public async Task CalculateAmortization_ValidInput_ReturnsOkResult()
        {
            // Arrange
            var loanRequest = new LoanRequest { LoanAmount = 100000, LoanTermYears = 30, InterestRate = 3.5m };
            var schedule = new List<AmortizationSchedule> { new AmortizationSchedule() };
            var scheduleDto = new List<AmortizationScheduleDto> { new AmortizationScheduleDto() };

            _mockRepository.Setup(r => r.GenerateAmortizationScheduleAsync(It.IsAny<LoanRequest>()))
                .ReturnsAsync(schedule);
            _mockMapper.Setup(m => m.Map<IEnumerable<AmortizationScheduleDto>>(It.IsAny<IEnumerable<AmortizationSchedule>>()))
                .Returns(scheduleDto);

            // Act
            var result = await _controller.CalculateAmortization(loanRequest);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.AreEqual(scheduleDto, okResult.Value);
        }

        [Test]
        public async Task CalculateAmortization_InvalidInput_ReturnsBadRequest()
        {
            // Arrange
            var loanRequest = new LoanRequest { LoanAmount = 0, LoanTermYears = 30, InterestRate = 3.5m };

            // Act
            var result = await _controller.CalculateAmortization(loanRequest);

            // Assert
            Assert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task GetSchedule_ExistingSchedule_ReturnsOkResult()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userLoanNumber = 1;
            var schedule = new List<AmortizationSchedule> { new AmortizationSchedule() };
            var scheduleDto = new List<AmortizationScheduleDto> { new AmortizationScheduleDto() };

            SetupUserContext(userId);
            _mockRepository.Setup(r => r.GetScheduleByUserLoanNumberAsync(userId, userLoanNumber))
                .ReturnsAsync(schedule);
            _mockMapper.Setup(m => m.Map<IEnumerable<AmortizationScheduleDto>>(It.IsAny<IEnumerable<AmortizationSchedule>>()))
                .Returns(scheduleDto);

            // Act
            var result = await _controller.GetSchedule(userLoanNumber);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.AreEqual(scheduleDto, okResult.Value);
        }

        [Test]
        public async Task GetSchedule_NonExistingSchedule_ReturnsNotFound()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userLoanNumber = 1;

            SetupUserContext(userId);
            _mockRepository.Setup(r => r.GetScheduleByUserLoanNumberAsync(userId, userLoanNumber))
                .ReturnsAsync(new List<AmortizationSchedule>());

            // Act
            var result = await _controller.GetSchedule(userLoanNumber);

            // Assert
            Assert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public void GetUserIdFromToken_ValidToken_ReturnsUserId()
        {
            // Arrange
            var userId = Guid.NewGuid();
            SetupUserContext(userId);

            // Act
            var result = _controller.GetType().GetMethod("GetUserIdFromToken", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .Invoke(_controller, null);

            // Assert
            Assert.AreEqual(userId, result);
        }

        [Test]
        public void GetUserIdFromToken_InvalidToken_ThrowsUnauthorizedAccessException()
        {
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act & Assert
            var exception = Assert.Throws<TargetInvocationException>(() =>
            {
                typeof(AmortizationController)
                    .GetMethod("GetUserIdFromToken", BindingFlags.NonPublic | BindingFlags.Instance)
                    .Invoke(_controller, null);
            });

            Assert.That(exception.InnerException, Is.TypeOf<UnauthorizedAccessException>());
            Assert.That(exception.InnerException.Message, Is.EqualTo("Invalid or missing User ID in token."));
        }

        private void SetupUserContext(Guid? userId)
        {
            var claims = new List<Claim>();
            if (userId.HasValue)
            {
                claims.Add(new Claim(ClaimTypes.NameIdentifier, userId.Value.ToString()));
            }
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext { User = claimsPrincipal }
            };
        }
    }
}
