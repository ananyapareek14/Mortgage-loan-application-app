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

namespace MortgageAPITest.Controllers
{
    [TestFixture]
    public class LoanControllerTests
    {
        private Mock<ILoanRepository> _loanRepositoryMock;
        private Mock<IMapper> _mapperMock;
        private Mock<ILogger<AuthController>> _loggerMock;
        private LoanController _controller;

        [SetUp]
        public void SetUp()
        {
            _loanRepositoryMock = new Mock<ILoanRepository>();
            _mapperMock = new Mock<IMapper>();
            _loggerMock = new Mock<ILogger<AuthController>>();

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

        [Test]
        public async Task GetAllLoans_NoLoansFound_ReturnsNotFound()
        {
            var userId = Guid.Parse(_controller.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            _loanRepositoryMock.Setup(r => r.GetAllLoansAsync(userId)).ReturnsAsync(new List<Loan>());

            var result = await _controller.GetAllLoans();

            Assert.IsInstanceOf<NotFoundObjectResult>(result);
        }
    }
}
