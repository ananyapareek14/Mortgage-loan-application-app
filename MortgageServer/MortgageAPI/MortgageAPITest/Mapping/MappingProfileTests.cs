using NUnit.Framework;
using AutoMapper;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using System;
using MortgageAPI.Models.Mapping;

namespace MortgageAPI.Tests.Models.Mapping
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
                Username = "testuser",
                Email = "test@example.com"
            };

            // Act
            var user = _mapper.Map<User>(registerRequest);

            // Assert
            Assert.That(user.userId, Is.Not.EqualTo(Guid.Empty));
            Assert.That(user.Username, Is.EqualTo(registerRequest.Username));
            Assert.That(user.Email, Is.EqualTo(registerRequest.Email));
            Assert.That(user.PasswordHash, Is.Null);
            Assert.That(user.Loans, Is.Null);
        }

        [Test]
        public void LoanRequest_To_Loan_MapsCorrectly()
        {
            // Arrange
            var loanRequest = new LoanRequest
            {
                LoanAmount = 100000,
                InterestRate = 3.5,
                LoanTerm = 30
            };

            // Act
            var loan = _mapper.Map<Loan>(loanRequest);

            // Assert
            Assert.That(loan.LoanAmount, Is.EqualTo(loanRequest.LoanAmount));
            Assert.That(loan.InterestRate, Is.EqualTo(loanRequest.InterestRate));
            Assert.That(loan.LoanTerm, Is.EqualTo(loanRequest.LoanTerm));
            Assert.That(loan.LoanId, Is.EqualTo(0));
            Assert.That(loan.UserId, Is.EqualTo(Guid.Empty));
            Assert.That(loan.UserLoanNumber, Is.Null);
            Assert.That(loan.ApplicationDate, Is.EqualTo(default(DateTime)));
            Assert.That(loan.ApprovalStatus, Is.Null);
            Assert.That(loan.User, Is.Null);
            Assert.That(loan.AmortizationSchedules, Is.Null);
        }

        [Test]
        public void Loan_To_LoanDto_MapsCorrectly()
        {
            // Arrange
            var loan = new Loan
            {
                LoanId = 1,
                UserId = Guid.NewGuid(),
                UserLoanNumber = "LOAN001",
                LoanAmount = 200000,
                InterestRate = 4.5,
                LoanTerm = 15
            };

            // Act
            var loanDto = _mapper.Map<LoanDto>(loan);

            // Assert
            Assert.That(loanDto.LoanId, Is.EqualTo(loan.LoanId));
            Assert.That(loanDto.UserId, Is.EqualTo(loan.UserId));
            Assert.That(loanDto.UserLoanNumber, Is.EqualTo(loan.UserLoanNumber));
            Assert.That(loanDto.LoanAmount, Is.EqualTo(loan.LoanAmount));
            Assert.That(loanDto.InterestRate, Is.EqualTo(loan.InterestRate));
            Assert.That(loanDto.LoanTerm, Is.EqualTo(loan.LoanTerm));
        }

        [Test]
        public void InterestRate_To_InterestRateDto_MapsCorrectly()
        {
            // Arrange
            var interestRate = new InterestRate
            {
                Id = 1,
                Rate = 3.75,
                EffectiveDate = DateTime.Now
            };

            // Act
            var interestRateDto = _mapper.Map<InterestRateDto>(interestRate);

            // Assert
            Assert.That(interestRateDto.Id, Is.EqualTo(interestRate.Id));
            Assert.That(interestRateDto.Rate, Is.EqualTo(interestRate.Rate));
            Assert.That(interestRateDto.EffectiveDate, Is.EqualTo(interestRate.EffectiveDate));
        }

        [Test]
        public void AmortizationSchedule_To_AmortizationScheduleDto_MapsAndRoundsCorrectly()
        {
            // Arrange
            var amortizationSchedule = new AmortizationSchedule
            {
                Id = 1,
                LoanId = 1,
                PaymentNumber = 1,
                PaymentDate = DateTime.Now,
                MonthlyPayment = 1234.56789,
                PrincipalPayment = 567.89012,
                InterestPayment = 666.67777,
                RemainingBalance = 98765.4321
            };

            // Act
            var amortizationScheduleDto = _mapper.Map<AmortizationScheduleDto>(amortizationSchedule);

            // Assert
            Assert.That(amortizationScheduleDto.Id, Is.EqualTo(amortizationSchedule.Id));
            Assert.That(amortizationScheduleDto.LoanId, Is.EqualTo(amortizationSchedule.LoanId));
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
                Id = 1,
                LoanId = 1,
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
                Id = 1,
                LoanId = 1,
                PaymentNumber = 1,
                PaymentDate = DateTime.Now,
                MonthlyPayment = -1234.56789,
                PrincipalPayment = -567.89012,
                InterestPayment = -666.67777,
                RemainingBalance = -98765.4321
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