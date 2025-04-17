using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Security.Claims;
using MortgageAPI.Controllers;
using MortgageAPI.Models.DTO;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos.Interfaces;
using System.Reflection;

namespace MortgageAPITest.Controllers
{
    [TestFixture]
    public class LoanControllerTests
    {
        private Mock<ILoanRepository> _loanRepositoryMock;
        private Mock<IMapper> _mapperMock;
        private Mock<ILogger<LoanController>> _loggerMock;
        private LoanController _controller;
        private Guid _userId;

        [SetUp]
        public void SetUp()
        {
            _loanRepositoryMock = new Mock<ILoanRepository>();
            _mapperMock = new Mock<IMapper>();
            _loggerMock = new Mock<ILogger<LoanController>>();

            _controller = new LoanController(_loanRepositoryMock.Object, _mapperMock.Object, _loggerMock.Object);

            _userId = Guid.NewGuid();
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, _userId.ToString())
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

            var loanDomain = new Loan
            {
                LoanAmount = request.LoanAmount,
                InterestRate = request.InterestRate,
                LoanTermYears = request.LoanTermYears
            };

            _mapperMock.Setup(m => m.Map<Loan>(request)).Returns(loanDomain);
            _loanRepositoryMock.Setup(r => r.AddLoanAsync(It.IsAny<Loan>())).Returns(Task.CompletedTask);

            var result = await _controller.SubmitLoan(request);

            Assert.IsInstanceOf<OkObjectResult>(result);
            var ok = result as OkObjectResult;
            Assert.IsTrue(ok?.Value?.ToString()?.Contains("Loan Application submitted successfully"));
        }

        [Test]
        public async Task SubmitLoan_InvalidToken_ReturnsUnauthorized()
        {
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            var request = new LoanRequest
            {
                LoanAmount = 100000,
                InterestRate = 5,
                LoanTermYears = 15
            };

            var result = await _controller.SubmitLoan(request);

            Assert.IsInstanceOf<UnauthorizedObjectResult>(result);
            var unauthorized = result as UnauthorizedObjectResult;
            Assert.AreEqual("Invalid or missing User ID in token.", unauthorized?.Value);
        }

        [Test]
        public void GetUserIdFromToken_InvalidToken_ThrowsUnauthorizedAccessException()
        {
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            var method = typeof(LoanController)
                .GetMethod("GetUserIdFromToken", BindingFlags.NonPublic | BindingFlags.Instance);

            var ex = Assert.Throws<TargetInvocationException>(() =>
            {
                method!.Invoke(_controller, null);
            });

            Assert.That(ex?.InnerException, Is.TypeOf<UnauthorizedAccessException>());
            Assert.That(ex?.InnerException?.Message, Is.EqualTo("Invalid or missing User ID in token."));
        }

        [Test]
        public async Task GetLoanDetails_ExistingLoan_ReturnsOkWithLoanDto()
        {
            var domainLoan = new Loan
            {
                LoanId = Guid.NewGuid(),
                UserId = _userId,
                UserLoanNumber = 1,
                ApplicationDate = new DateTime(2024, 12, 1),
                ApprovalStatus = LoanApprovalStatus.Pending,
                LoanAmount = 50000,
                InterestRate = 5,
                LoanTermYears = 10
            };

            var loanDto = new LoanDto
            {
                LoanId = domainLoan.LoanId,
                UserLoanNumber = domainLoan.UserLoanNumber,
                ApplicationDate = domainLoan.ApplicationDate,
                ApprovalStatus = domainLoan.ApprovalStatus.ToString(),
                LoanAmount = domainLoan.LoanAmount,
                InterestRate = domainLoan.InterestRate,
                LoanTermYears = domainLoan.LoanTermYears
            };

            _loanRepositoryMock.Setup(r => r.GetLoanByUserLoanNumberAsync(1, _userId)).ReturnsAsync(domainLoan);
            _mapperMock.Setup(m => m.Map<LoanDto>(domainLoan)).Returns(loanDto);

            var result = await _controller.GetLoanDetails(1);

            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);

            var returnedDto = okResult!.Value as LoanDto;
            Assert.IsNotNull(returnedDto);
            Assert.AreEqual(domainLoan.LoanId, returnedDto!.LoanId);
            Assert.AreEqual(domainLoan.UserLoanNumber, returnedDto.UserLoanNumber);
            Assert.AreEqual(domainLoan.ApplicationDate, returnedDto.ApplicationDate);
            Assert.AreEqual(domainLoan.ApprovalStatus.ToString(), returnedDto.ApprovalStatus);
            Assert.AreEqual(domainLoan.LoanAmount, returnedDto.LoanAmount);
            Assert.AreEqual(domainLoan.InterestRate, returnedDto.InterestRate);
            Assert.AreEqual(domainLoan.LoanTermYears, returnedDto.LoanTermYears);
        }

        [Test]
        public async Task GetLoanDetails_LoanNotFound_ReturnsNotFound()
        {
            _loanRepositoryMock.Setup(r => r.GetLoanByUserLoanNumberAsync(1, _userId)).ReturnsAsync((Loan)null!);

            var result = await _controller.GetLoanDetails(1);

            Assert.IsInstanceOf<NotFoundObjectResult>(result);
            var notFound = result as NotFoundObjectResult;
            Assert.AreEqual("Loan not found.", notFound?.Value);
        }

        [Test]
        public async Task GetAllLoans_UserHasLoans_ReturnsOkWithLoanDtoList()
        {
            var domainLoans = new List<Loan>
            {
                new Loan { UserId = _userId, LoanAmount = 80000 }
            };

            var loanDtos = new List<LoanDto>
            {
                new LoanDto { LoanAmount = 80000 }
            };

            _loanRepositoryMock.Setup(r => r.GetAllLoansAsync(_userId)).ReturnsAsync(domainLoans);
            _mapperMock.Setup(m => m.Map<IEnumerable<LoanDto>>(domainLoans)).Returns(loanDtos);

            var result = await _controller.GetAllLoans();

            Assert.IsInstanceOf<OkObjectResult>(result);
            var ok = result as OkObjectResult;
            Assert.IsInstanceOf<IEnumerable<LoanDto>>(ok?.Value);
        }

        [Test]
        public async Task GetAllLoans_NoLoansFound_ReturnsNotFound()
        {
            _loanRepositoryMock.Setup(r => r.GetAllLoansAsync(_userId)).ReturnsAsync(new List<Loan>());

            var result = await _controller.GetAllLoans();

            Assert.IsInstanceOf<NotFoundObjectResult>(result);
            var notFound = result as NotFoundObjectResult;
            Assert.AreEqual("No loans found.", notFound?.Value);
        }

        [Test]
        public async Task GetAllLoans_NullLoanList_ReturnsNotFound()
        {
            _loanRepositoryMock.Setup(r => r.GetAllLoansAsync(_userId)).ReturnsAsync((List<Loan>)null!);

            var result = await _controller.GetAllLoans();

            Assert.IsInstanceOf<NotFoundObjectResult>(result);
            var notFound = result as NotFoundObjectResult;
            Assert.AreEqual("No loans found.", notFound?.Value);
        }
    }
}
