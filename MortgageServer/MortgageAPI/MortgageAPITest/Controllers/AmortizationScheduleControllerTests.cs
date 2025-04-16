//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Reflection;
//using System.Security.Claims;
//using System.Text;
//using System.Threading.Tasks;
//using AutoMapper;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Extensions.Logging;
//using Moq;
//using MortgageAPI.Controllers;
//using MortgageAPI.Models.Domain;
//using MortgageAPI.Models.DTO;
//using MortgageAPI.Repos.Interfaces;

//namespace MortgageAPITest.Controllers
//{
//    [TestFixture]
//    public class AmortizationControllerTests
//    {
//        private Mock<IAmortizationScheduleRepository> _repoMock;
//        private Mock<IMapper> _mapperMock;
//        private Mock<ILogger<AmortizationController>> _loggerMock;
//        private AmortizationController _controller;

//        [SetUp]
//        public void Setup()
//        {
//            _repoMock = new Mock<IAmortizationScheduleRepository>();
//            _mapperMock = new Mock<IMapper>();
//            _loggerMock = new Mock<ILogger<AmortizationController>>();
//            _controller = new AmortizationController(_repoMock.Object, _mapperMock.Object, _loggerMock.Object);
//        }

//        private void SetUserContext(Guid userId)
//        {
//            var claims = new List<Claim>
//        {
//            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
//        };

//            var identity = new ClaimsIdentity(claims, "TestAuthType");
//            var claimsPrincipal = new ClaimsPrincipal(identity);

//            _controller.ControllerContext = new ControllerContext
//            {
//                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
//            };
//        }

//        [Test]
//        public async Task CalculateAmortization_ValidRequest_ReturnsOkResult()
//        {
//            var request = new LoanRequest { LoanAmount = 100000, InterestRate = 5, LoanTermYears = 30 };
//            var domainSchedule = new List<AmortizationSchedule> { new AmortizationSchedule() };
//            var dtoSchedule = new List<AmortizationScheduleDto> { new AmortizationScheduleDto() };

//            _repoMock.Setup(r => r.GenerateAmortizationScheduleAsync(request)).ReturnsAsync(domainSchedule);
//            _mapperMock.Setup(m => m.Map<IEnumerable<AmortizationScheduleDto>>(domainSchedule)).Returns(dtoSchedule);

//            var result = await _controller.CalculateAmortization(request) as OkObjectResult;

//            Assert.That(result, Is.Not.Null);
//            Assert.That(result.StatusCode, Is.EqualTo(200));
//            Assert.That(result.Value, Is.EqualTo(dtoSchedule));
//        }

//        [Test]
//        public async Task CalculateAmortization_InvalidRequest_ReturnsBadRequest()
//        {
//            var invalidRequest = new LoanRequest { LoanAmount = 0, InterestRate = -2, LoanTermYears = 0 };

//            var result = await _controller.CalculateAmortization(invalidRequest) as BadRequestObjectResult;

//            Assert.That(result, Is.Not.Null);
//            Assert.That(result.StatusCode, Is.EqualTo(400));
//            Assert.That(result.Value, Is.EqualTo("Invalid loan details. Ensure all values are greater than zero."));
//        }

//        [Test]
//        public async Task GetSchedule_ScheduleExists_ReturnsOk()
//        {
//            var userId = Guid.NewGuid();
//            var userLoanNumber = 1;
//            var domainSchedule = new List<AmortizationSchedule> { new AmortizationSchedule() };
//            var dtoSchedule = new List<AmortizationScheduleDto> { new AmortizationScheduleDto() };

//            _repoMock.Setup(r => r.GetScheduleByUserLoanNumberAsync(userId, userLoanNumber)).ReturnsAsync(domainSchedule);
//            _mapperMock.Setup(m => m.Map<IEnumerable<AmortizationScheduleDto>>(domainSchedule)).Returns(dtoSchedule);

//            SetUserContext(userId);

//            var result = await _controller.GetSchedule(userLoanNumber) as OkObjectResult;

//            Assert.That(result, Is.Not.Null);
//            Assert.That(result.StatusCode, Is.EqualTo(200));
//            Assert.That(result.Value, Is.EqualTo(dtoSchedule));
//        }

//        [Test]
//        public async Task GetSchedule_ScheduleNotFound_ReturnsNotFound()
//        {
//            var userId = Guid.NewGuid();
//            var userLoanNumber = 999;

//            _repoMock.Setup(r => r.GetScheduleByUserLoanNumberAsync(userId, userLoanNumber)).ReturnsAsync(new List<AmortizationSchedule>());

//            SetUserContext(userId);

//            var result = await _controller.GetSchedule(userLoanNumber) as NotFoundObjectResult;

//            Assert.That(result, Is.Not.Null);
//            Assert.That(result.StatusCode, Is.EqualTo(404));
//            Assert.That(result.Value, Is.EqualTo("Schedule not found."));
//        }

//        [Test]
//        public void GetUserIdFromToken_InvalidToken_ThrowsUnauthorizedAccessException()
//        {
//            _controller.ControllerContext = new ControllerContext
//            {
//                HttpContext = new DefaultHttpContext()
//            };

//            var method = typeof(AmortizationController).GetMethod("GetUserIdFromToken", BindingFlags.NonPublic | BindingFlags.Instance);

//            var ex = Assert.Throws<TargetInvocationException>(() =>
//            {
//                method.Invoke(_controller, null);
//            });

//            Assert.That(ex.InnerException, Is.TypeOf<UnauthorizedAccessException>());
//            Assert.That(ex.InnerException.Message, Is.EqualTo("Invalid or missing User ID in token."));
//        }
//    }
//}


using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MortgageAPI.Controllers;
using MortgageAPI.Models;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Reflection;
using System.Threading.Tasks;
using MortgageAPI.Models.Domain;

namespace MortgageAPITest.Controllers
{
    [TestFixture]
    public class AmortizationControllerTests
    {
        private Mock<IAmortizationScheduleRepository> _mockRepo;
        private Mock<IMapper> _mockMapper;
        private Mock<ILogger<AmortizationController>> _mockLogger;
        private AmortizationController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockRepo = new Mock<IAmortizationScheduleRepository>();
            _mockMapper = new Mock<IMapper>();
            _mockLogger = new Mock<ILogger<AmortizationController>>();

            _controller = new AmortizationController(_mockRepo.Object, _mockMapper.Object, _mockLogger.Object);
        }

        [Test]
        public async Task CalculateAmortization_ValidLoanRequest_ReturnsOk()
        {
            var request = new LoanRequest { LoanAmount = 100000, InterestRate = 5, LoanTermYears = 30 };
            var schedule = new List<AmortizationSchedule> { new() };
            var scheduleDto = new List<AmortizationScheduleDto>();

            _mockRepo.Setup(r => r.GenerateAmortizationScheduleAsync(request)).ReturnsAsync(schedule);
            _mockMapper.Setup(m => m.Map<IEnumerable<AmortizationScheduleDto>>(schedule)).Returns(scheduleDto);

            var result = await _controller.CalculateAmortization(request);

            Assert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task CalculateAmortization_InvalidLoanRequest_ReturnsBadRequest()
        {
            var request = new LoanRequest { LoanAmount = -1, InterestRate = 0, LoanTermYears = 0 };

            var result = await _controller.CalculateAmortization(request);

            Assert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task GetSchedule_NameIdentifierClaimExists_ReturnsOk()
        {
            var userId = Guid.NewGuid();
            var userLoanNumber = 1;

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString())
            };

            var user = new ClaimsPrincipal(new ClaimsIdentity(claims, "mock"));
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var schedule = new List<AmortizationSchedule> { new() };
            var scheduleDto = new List<AmortizationScheduleDto>();

            _mockRepo.Setup(r => r.GetScheduleByUserLoanNumberAsync(userId, userLoanNumber)).ReturnsAsync(schedule);
            _mockMapper.Setup(m => m.Map<IEnumerable<AmortizationScheduleDto>>(schedule)).Returns(scheduleDto);

            var result = await _controller.GetSchedule(userLoanNumber);

            Assert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task GetSchedule_NameIdClaimUsedAsFallback_ReturnsOk()
        {
            var userId = Guid.NewGuid();
            var userLoanNumber = 1;

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, userId.ToString())
            };

            var user = new ClaimsPrincipal(new ClaimsIdentity(claims, "mock"));
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var schedule = new List<AmortizationSchedule> { new() };
            var scheduleDto = new List<AmortizationScheduleDto>();

            _mockRepo.Setup(r => r.GetScheduleByUserLoanNumberAsync(userId, userLoanNumber)).ReturnsAsync(schedule);
            _mockMapper.Setup(m => m.Map<IEnumerable<AmortizationScheduleDto>>(schedule)).Returns(scheduleDto);

            var result = await _controller.GetSchedule(userLoanNumber);

            Assert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task GetSchedule_ScheduleNotFound_ReturnsNotFound()
        {
            var userId = Guid.NewGuid();
            var userLoanNumber = 1;

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString())
            };

            var user = new ClaimsPrincipal(new ClaimsIdentity(claims, "mock"));
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            _mockRepo.Setup(r => r.GetScheduleByUserLoanNumberAsync(userId, userLoanNumber))
                     .ReturnsAsync(new List<AmortizationSchedule>());

            var result = await _controller.GetSchedule(userLoanNumber);

            Assert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public void GetUserIdFromToken_InvalidToken_ThrowsUnauthorizedAccessException()
        {
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext() // No claims set
            };

            var method = typeof(AmortizationController)
                .GetMethod("GetUserIdFromToken", BindingFlags.NonPublic | BindingFlags.Instance);

            var ex = Assert.Throws<TargetInvocationException>(() =>
            {
                method.Invoke(_controller, null);
            });

            Assert.That(ex.InnerException, Is.TypeOf<UnauthorizedAccessException>());
            Assert.That(ex.InnerException.Message, Is.EqualTo("Invalid or missing User ID in token."));
        }
    }
}
