using AutoMapper;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Models.Mapping;

namespace MortgageAPITest.Models.Mapping
{
    [TestFixture]
    public class MappingProfileTests
    {
        private IMapper _mapper;

        [SetUp]
        public void Setup()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
            _mapper = config.CreateMapper();
        }

        [Test]
        public void RegisterRequest_To_User_MapsCorrectly()
        {
            // Arrange
            var registerRequest = new RegisterRequest
            {
                username = "test@example.com",
                password = "testpassword",
                role = "User"
            };

            // Act
            var user = _mapper.Map<User>(registerRequest);

            // Assert
            Assert.That(user.userId, Is.Not.EqualTo(Guid.Empty));
            Assert.That(user.Username, Is.EqualTo(registerRequest.username));
            Assert.That(user.Role, Is.EqualTo(registerRequest.role));
            Assert.That(string.IsNullOrEmpty(user.PasswordHash));
            Assert.That(user.Loans, Is.Null.Or.Empty);

        }


        [Test]
        public void LoanRequest_To_Loan_MapsCorrectly()
        {
            // Arrange
            var loanRequest = new LoanRequest
            {
                LoanAmount = 100000,
                InterestRate = 3.5M,
                LoanTermYears = 30
            };

            // Act
            var loan = _mapper.Map<Loan>(loanRequest);

            // Assert
            Assert.That(loan.LoanAmount, Is.EqualTo(loanRequest.LoanAmount));
            Assert.That(loan.InterestRate, Is.EqualTo(loanRequest.InterestRate));
            Assert.That(loan.LoanTermYears, Is.EqualTo(loanRequest.LoanTermYears));
            Assert.That(loan.LoanId, Is.Not.EqualTo(Guid.Empty));
            Assert.That(loan.UserId, Is.EqualTo(Guid.Empty));
            Assert.That(loan.ApplicationDate, Is.GreaterThan(DateTime.UtcNow.AddMinutes(-1)));
            Assert.That(loan.User, Is.Null);
            Assert.That(loan.AmortizationSchedules, Is.Null.Or.Empty);
        }

        [Test]
        public void Loan_To_LoanDto_MapsCorrectly()
        {
            // Arrange
            var loan = new Loan
            {
                LoanId = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                UserLoanNumber = 1,
                LoanAmount = 200000,
                InterestRate = 4.5M,
                LoanTermYears = 15
            };

            // Act
            var loanDto = _mapper.Map<LoanDto>(loan);

            // Assert
            Assert.That(loanDto.LoanId, Is.EqualTo(loan.LoanId));
            Assert.That(loanDto.UserLoanNumber, Is.EqualTo(loan.UserLoanNumber));
            Assert.That(loanDto.LoanAmount, Is.EqualTo(loan.LoanAmount));
            Assert.That(loanDto.InterestRate, Is.EqualTo(loan.InterestRate));
            Assert.That(loanDto.LoanTermYears, Is.EqualTo(loan.LoanTermYears));
        }

        [Test]
        public void InterestRate_To_InterestRateDto_MapsCorrectly()
        {
            // Arrange
            var interestRate = new InterestRate
            {
                Id = Guid.NewGuid(),
                Rate = 3.75M,
                ValidFrom = DateTime.Now
            };

            // Act
            var interestRateDto = _mapper.Map<InterestRateDto>(interestRate);

            // Assert
            Assert.That(interestRateDto.Id, Is.EqualTo(interestRate.Id));
            Assert.That(interestRateDto.Rate, Is.EqualTo(interestRate.Rate));
            Assert.That(interestRateDto.ValidFrom, Is.EqualTo(interestRate.ValidFrom));
        }

        [Test]
        public void AmortizationSchedule_To_AmortizationScheduleDto_MapsAndRoundsCorrectly()
        {
            // Arrange
            var amortizationSchedule = new AmortizationSchedule
            {
                Id = Guid.NewGuid(),
                LoanId = Guid.NewGuid(),
                PaymentNumber = 1,
                PaymentDate = DateTime.Now,
                MonthlyPayment = 1234.56789M,
                PrincipalPayment = 567.89012M,
                InterestPayment = 666.67777M,
                RemainingBalance = 98765.4321M
            };

            // Act
            var amortizationScheduleDto = _mapper.Map<AmortizationScheduleDto>(amortizationSchedule);

            // Assert
            Assert.That(amortizationScheduleDto.PaymentNumber, Is.EqualTo(amortizationSchedule.PaymentNumber));
            Assert.That(amortizationScheduleDto.PaymentDate, Is.EqualTo(amortizationSchedule.PaymentDate));
            Assert.That(amortizationScheduleDto.MonthlyPayment, Is.EqualTo(1234.57));
            Assert.That(amortizationScheduleDto.PrincipalPayment, Is.EqualTo(567.89));
            Assert.That(amortizationScheduleDto.InterestPayment, Is.EqualTo(666.68));
            Assert.That(amortizationScheduleDto.RemainingBalance, Is.EqualTo(98765.43));
        }

        [Test]
        public void AmortizationSchedule_To_AmortizationScheduleDto_HandlesZeroValues()
        {
            // Arrange
            var amortizationSchedule = new AmortizationSchedule
            {
                Id = Guid.NewGuid(),
                LoanId = Guid.NewGuid(),
                PaymentNumber = 1,
                PaymentDate = DateTime.Now,
                MonthlyPayment = 0,
                PrincipalPayment = 0,
                InterestPayment = 0,
                RemainingBalance = 0
            };

            // Act
            var amortizationScheduleDto = _mapper.Map<AmortizationScheduleDto>(amortizationSchedule);

            // Assert
            Assert.That(amortizationScheduleDto.MonthlyPayment, Is.EqualTo(0));
            Assert.That(amortizationScheduleDto.PrincipalPayment, Is.EqualTo(0));
            Assert.That(amortizationScheduleDto.InterestPayment, Is.EqualTo(0));
            Assert.That(amortizationScheduleDto.RemainingBalance, Is.EqualTo(0));
        }

        [Test]
        public void AmortizationSchedule_To_AmortizationScheduleDto_HandlesNegativeValues()
        {
            // Arrange
            var amortizationSchedule = new AmortizationSchedule
            {
                Id = Guid.NewGuid(),
                LoanId = Guid.NewGuid(),
                PaymentNumber = 1,
                PaymentDate = DateTime.Now,
                MonthlyPayment = -1234.56789M,
                PrincipalPayment = -567.89012M,
                InterestPayment = -666.67777M,
                RemainingBalance = -98765.4321M
            };

            // Act
            var amortizationScheduleDto = _mapper.Map<AmortizationScheduleDto>(amortizationSchedule);

            // Assert
            Assert.That(amortizationScheduleDto.MonthlyPayment, Is.EqualTo(-1234.57));
            Assert.That(amortizationScheduleDto.PrincipalPayment, Is.EqualTo(-567.89));
            Assert.That(amortizationScheduleDto.InterestPayment, Is.EqualTo(-666.68));
            Assert.That(amortizationScheduleDto.RemainingBalance, Is.EqualTo(-98765.43));
        }
    }
}