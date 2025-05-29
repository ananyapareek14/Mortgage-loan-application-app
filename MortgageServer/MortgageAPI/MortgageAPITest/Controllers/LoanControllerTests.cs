using System;
using System.Collections.Generic;
using System.Reflection;
using System.Security.Claims;
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
using NUnit.Framework;

namespace MortgageAPITest.Controllers
{
    [TestFixture]
    public class LoanControllerTests
    {
        private Mock<ILoanRepository> _mockLoanRepository;
        private Mock<IMapper> _mockMapper;
        private Mock<ILogger<LoanController>> _mockLogger;
        private LoanController _controller;

        [SetUp]
        public void Setup()
        {
            _mockLoanRepository = new Mock<ILoanRepository>();
            _mockMapper = new Mock<IMapper>();
            _mockLogger = new Mock<ILogger<LoanController>>();
            _controller = new LoanController(_mockLoanRepository.Object, _mockMapper.Object, _mockLogger.Object);

            // Setup ClaimsPrincipal
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())
            };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };
        }

        [Test]
        public async Task SubmitLoan_ValidRequest_ReturnsOkResult()
        {
            // Arrange
            var loanRequest = new LoanRequest { LoanAmount = 100000, LoanTermYears = 30 };
            var loan = new Loan { LoanId = Guid.NewGuid(), LoanAmount = 100000, LoanTermYears = 30 };
            _mockMapper.Setup(m => m.Map<Loan>(It.IsAny<LoanRequest>())).Returns(loan);
            _mockLoanRepository.Setup(r => r.AddLoanAsync(It.IsAny<Loan>())).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.SubmitLoan(loanRequest);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual("Loan Application submitted successfully", (okResult.Value as dynamic).message);
        }

        [Test]
        public async Task SubmitLoan_InvalidUserId_ReturnsUnauthorized()
        {
            // Arrange
            var loanRequest = new LoanRequest { LoanAmount = 100000, LoanTermYears = 30 };
            _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity());

            // Act
            var result = await _controller.SubmitLoan(loanRequest);

            // Assert
            Assert.IsInstanceOf<UnauthorizedObjectResult>(result);
        }

        //[Test]
        //public async Task GetLoanDetails_ExistingLoan_ReturnsOkResult()
        //{
        //    // Arrange
        //    var userLoanNumber = 1;
        //    var userId = Guid.NewGuid();
        //    var loan = new Loan { LoanId = Guid.NewGuid(), UserLoanNumber = userLoanNumber, UserId = userId };
        //    var loanDto = new LoanDto { LoanId = loan.LoanId, UserLoanNumber = loan.UserLoanNumber };

        //    _mockLoanRepository.Setup(r => r.GetLoanByUserLoanNumberAsync(userLoanNumber, userId)).ReturnsAsync(loan);
        //    _mockMapper.Setup(m => m.Map<LoanDto>(loan)).Returns(loanDto);

        //    // Act
        //    var result = await _controller.GetLoanDetails(userLoanNumber);

        //    // Assert
        //    Assert.IsInstanceOf<OkObjectResult>(result);
        //    var okResult = result as OkObjectResult;
        //    Assert.IsNotNull(okResult);
        //    Assert.AreEqual(loanDto, okResult.Value);
        //}

        [Test]
        public async Task GetLoanDetails_ExistingLoan_ReturnsOkResult()
        {
            // Arrange
            var userLoanNumber = 1;
            var userId = Guid.NewGuid(); // Same userId must go into claims

            var loan = new Loan { LoanId = Guid.NewGuid(), UserLoanNumber = userLoanNumber, UserId = userId };
            var loanDto = new LoanDto { LoanId = loan.LoanId, UserLoanNumber = loan.UserLoanNumber };

            // Setup ClaimsPrincipal with matching userId
            var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            _mockLoanRepository.Setup(r => r.GetLoanByUserLoanNumberAsync(userLoanNumber, userId)).ReturnsAsync(loan);
            _mockMapper.Setup(m => m.Map<LoanDto>(loan)).Returns(loanDto);

            // Act
            var result = await _controller.GetLoanDetails(userLoanNumber);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.That(okResult.Value, Is.EqualTo(loanDto));
        }


        [Test]
        public async Task GetLoanDetails_NonExistingLoan_ReturnsNotFound()
        {
            // Arrange
            var userLoanNumber = 1;
            var userId = Guid.NewGuid();

            _mockLoanRepository.Setup(r => r.GetLoanByUserLoanNumberAsync(userLoanNumber, userId)).ReturnsAsync((Loan)null);

            // Act
            var result = await _controller.GetLoanDetails(userLoanNumber);

            // Assert
            Assert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        //[Test]
        //public async Task GetAllLoans_ExistingLoans_ReturnsOkResult()
        //{
        //    // Arrange
        //    var userId = Guid.NewGuid();
        //    var loans = new List<Loan> { new Loan { LoanId = Guid.NewGuid(), UserId = userId } };
        //    var loansDto = new List<LoanDto> { new LoanDto { LoanId = loans[0].LoanId } };

        //    _mockLoanRepository.Setup(r => r.GetAllLoansAsync(userId)).ReturnsAsync(loans);
        //    _mockMapper.Setup(m => m.Map<IEnumerable<LoanDto>>(loans)).Returns(loansDto);

        //    // Act
        //    var result = await _controller.GetAllLoans();

        //    // Assert
        //    Assert.IsInstanceOf<OkObjectResult>(result);
        //    var okResult = result as OkObjectResult;
        //    Assert.IsNotNull(okResult);
        //    Assert.AreEqual(loansDto, okResult.Value);
        //}

        [Test]
        public async Task GetAllLoans_ExistingLoans_ReturnsOkResult()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var loans = new List<Loan> { new Loan { LoanId = Guid.NewGuid(), UserId = userId } };
            var loansDto = new List<LoanDto> { new LoanDto { LoanId = loans[0].LoanId } };

            // Setup mock claims with matching userId
            var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            _mockLoanRepository.Setup(r => r.GetAllLoansAsync(userId)).ReturnsAsync(loans);
            _mockMapper.Setup(m => m.Map<IEnumerable<LoanDto>>(loans)).Returns(loansDto);

            // Act
            var result = await _controller.GetAllLoans();

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.That(okResult.Value, Is.EqualTo(loansDto));
        }


        [Test]
        public async Task GetAllLoans_NoLoans_ReturnsNotFound()
        {
            // Arrange
            var userId = Guid.NewGuid();
            _mockLoanRepository.Setup(r => r.GetAllLoansAsync(userId)).ReturnsAsync(new List<Loan>());

            // Act
            var result = await _controller.GetAllLoans();

            // Assert
            Assert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public void GetUserIdFromToken_ValidToken_ReturnsUserId()
        {
            // Arrange
            var expectedUserId = Guid.NewGuid();
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, expectedUserId.ToString())
            };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            // Act
            var result = _controller.GetType().GetMethod("GetUserIdFromToken", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance).Invoke(_controller, null);

            // Assert
            Assert.That(result, Is.EqualTo(expectedUserId));
        }

        [Test]
        public void GetUserIdFromToken_InvalidToken_ThrowsUnauthorizedAccessException()
        {
            // Arrange
            _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity());

            // Act & Assert
            var method = _controller.GetType().GetMethod("GetUserIdFromToken", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);

            var ex = Assert.Throws<TargetInvocationException>(() => method.Invoke(_controller, null));
            Assert.IsInstanceOf<UnauthorizedAccessException>(ex.InnerException);
            Assert.That(ex.InnerException.Message, Is.EqualTo("Invalid or missing User ID in token."));
        }

    }
}
