using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using MortgageAPI.Controllers;
using MortgageAPI.Models.DTO;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos;
using MortgageAPI.Repos.Interfaces;
using System.Reflection;
using System;

namespace MortgageAPITest.Controllers
{
    [TestFixture]
    public class LoanControllerTests
    {
        private Mock<ILoanRepository> _loanRepositoryMock;
        private Mock<IMapper> _mapperMock;
        private Mock<ILogger<LoanController>> _loggerMock;
        private LoanController _controller;

        [SetUp]
        public void SetUp()
        {
            _loanRepositoryMock = new Mock<ILoanRepository>();
            _mapperMock = new Mock<IMapper>();
            _loggerMock = new Mock<ILogger<LoanController>>();

            _controller = new LoanController(_loanRepositoryMock.Object, _mapperMock.Object, _loggerMock.Object);

            // Mock authenticated user with user ID
            var userId = Guid.NewGuid().ToString();
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId)
            }, "mock"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }

        [Test]
        public async Task SubmitLoan_ValidRequest_ReturnsOk()
        {
            var request = new LoanRequest
            {
                LoanAmount = 100000,
                InterestRate = 5,
                LoanTermYears = 15
            };

            _mapperMock.Setup(m => m.Map<Loan>(request))
                .Returns(new Loan());

            var result = await _controller.SubmitLoan(request);

            Assert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task SubmitLoan_InvalidToken_ReturnsUnauthorized()
        {
            // Arrange: No claims set to simulate invalid token
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext() // No claims
            };

            var request = new LoanRequest
            {
                LoanAmount = 100000,
                InterestRate = 5,
                LoanTermYears = 15
            };

            // Act
            var result = await _controller.SubmitLoan(request);

            // Assert
            Assert.IsInstanceOf<UnauthorizedObjectResult>(result);
            var unauthorizedResult = result as UnauthorizedObjectResult;
            Assert.AreEqual("Invalid or missing User ID in token.", unauthorizedResult.Value);

            // Verify logger call
            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Warning,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Unauthorized loan submission attempt")),
                    It.IsAny<UnauthorizedAccessException>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Test]
        public async Task SubmitLoan_NoUserClaim_ReturnsUnauthorized()
        {
            // Arrange: No claims set to simulate missing user ID
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext() // No claims
            };

            var request = new LoanRequest
            {
                LoanAmount = 100000,
                InterestRate = 5,
                LoanTermYears = 15
            };

            // Act
            var result = await _controller.SubmitLoan(request);

            // Assert
            Assert.IsInstanceOf<UnauthorizedObjectResult>(result);
            var unauthorizedResult = result as UnauthorizedObjectResult;
            Assert.AreEqual("Invalid or missing User ID in token.", unauthorizedResult.Value);
        }

        [Test]
        public void GetUserIdFromToken_InvalidToken_ThrowsUnauthorizedAccessException()
        {
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext() // No claims set
            };

            var method = typeof(LoanController)
                .GetMethod("GetUserIdFromToken", BindingFlags.NonPublic | BindingFlags.Instance);

            var ex = Assert.Throws<TargetInvocationException>(() =>
            {
                method.Invoke(_controller, null);
            });

            Assert.That(ex.InnerException, Is.TypeOf<UnauthorizedAccessException>());
            Assert.That(ex.InnerException.Message, Is.EqualTo("Invalid or missing User ID in token."));
        }

        [Test]
        public async Task GetLoanDetails_ExistingLoan_ReturnsOkWithLoan()
        {
            var userId = Guid.Parse(_controller.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var loan = new Loan { UserId = userId, LoanAmount = 50000, InterestRate = 5 };
            _loanRepositoryMock.Setup(r => r.GetLoanByUserLoanNumberAsync(1, userId)).ReturnsAsync(loan);
            _mapperMock.Setup(m => m.Map<LoanDto>(loan)).Returns(new LoanDto { LoanAmount = 50000 });

            var result = await _controller.GetLoanDetails(1);

            Assert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task GetLoanDetails_LoanNotFound_ReturnsNotFound()
        {
            var userId = Guid.Parse(_controller.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            _loanRepositoryMock.Setup(r => r.GetLoanByUserLoanNumberAsync(1, userId)).ReturnsAsync((Loan)null);

            var result = await _controller.GetLoanDetails(1);

            Assert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public async Task GetAllLoans_UserHasLoans_ReturnsOk()
        {
            var userId = Guid.Parse(_controller.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var loans = new List<Loan> { new Loan { UserId = userId } };
            _loanRepositoryMock.Setup(r => r.GetAllLoansAsync(userId)).ReturnsAsync(loans);
            _mapperMock.Setup(m => m.Map<IEnumerable<LoanDto>>(loans)).Returns(new List<LoanDto>());

            var result = await _controller.GetAllLoans();

            Assert.IsInstanceOf<OkObjectResult>(result);
        }

        //[Test]
        //public async Task GetAllLoans_NoLoansFound_ReturnsNotFound()
        //{
        //    var userId = Guid.Parse(_controller.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        //    _loanRepositoryMock.Setup(r => r.GetAllLoansAsync(userId)).ReturnsAsync(new List<Loan>());

        //    var result = await _controller.GetAllLoans();

        //    Assert.IsInstanceOf<NotFoundObjectResult>(result);
        //}

        [Test]
        public async Task GetAllLoans_NullLoanList_ReturnsNotFound()
        {
            var userId = Guid.Parse(_controller.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            _loanRepositoryMock.Setup(r => r.GetAllLoansAsync(userId)).ReturnsAsync((List<Loan>)null!);

            var result = await _controller.GetAllLoans();

            Assert.IsInstanceOf<NotFoundObjectResult>(result);
            var notFound = result as NotFoundObjectResult;
            Assert.AreEqual("No loans found.", notFound.Value);
        }

    }
}
