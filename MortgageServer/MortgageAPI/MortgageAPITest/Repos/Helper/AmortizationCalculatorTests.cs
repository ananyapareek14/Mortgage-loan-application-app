//using NUnit.Framework;
//using MortgageAPI.Models.Domain;
//using MortgageAPI.Repos.Helper;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using MortgageAPI.Repos.Helper.Interface;

//namespace MortgageAPITest.Repos.Helper
//{
//    [TestFixture]
//    public class AmortizationCalculatorTests
//    {
//        private IAmortizationCalculator _calculator;

//        [SetUp]
//        public void Setup()
//        {
//            _calculator = new AmortizationCalculator();
//        }

//        [Test]
//        public void GenerateSchedule_NormalScenario_ReturnsCorrectSchedule()
//        {
//            // Arrange
//            var loan = new Loan
//            {
//                LoanId = Guid.NewGuid(),
//                LoanAmount = 200000,
//                InterestRate = 5,
//                LoanTermYears = 30,
//                ApplicationDate = new DateTime(2023, 1, 1)
//            };

//            // Act
//            var schedule = _calculator.GenerateSchedule(loan);

//            // Assert
//            Assert.That(schedule, Has.Count.EqualTo(360)); // 30 years * 12 months
//            Assert.That(schedule[0].PaymentNumber, Is.EqualTo(1));
//            Assert.That(schedule[359].PaymentNumber, Is.EqualTo(360));
//            Assert.That(schedule[359].RemainingBalance, Is.EqualTo(0));
//        }

//        [Test]
//        public void GenerateSchedule_ShortTermLoan_ReturnsCorrectSchedule()
//        {
//            // Arrange
//            var loan = new Loan
//            {
//                LoanId = Guid.NewGuid(),
//                LoanAmount = 10000,
//                InterestRate = 4,
//                LoanTermYears = 1,
//                ApplicationDate = new DateTime(2023, 1, 1)
//            };

//            // Act
//            var schedule = _calculator.GenerateSchedule(loan);

//            // Assert
//            Assert.That(schedule, Has.Count.EqualTo(12)); // 1 year * 12 months
//            Assert.That(schedule[11].RemainingBalance, Is.EqualTo(0));
//        }

//        [Test]
//        public void GenerateSchedule_HighInterestRate_ReturnsCorrectSchedule()
//        {
//            // Arrange
//            var loan = new Loan
//            {
//                LoanId = Guid.NewGuid(),
//                LoanAmount = 100000,
//                InterestRate = 20,
//                LoanTermYears = 5,
//                ApplicationDate = new DateTime(2023, 1, 1)
//            };

//            // Act
//            var schedule = _calculator.GenerateSchedule(loan);

//            // Assert
//            Assert.That(schedule, Has.Count.EqualTo(60)); // 5 years * 12 months
//            Assert.That(schedule[0].InterestPayment, Is.GreaterThan(schedule[0].PrincipalPayment));
//        }

//        [Test]
//        public void GenerateSchedule_LargeAmount_ReturnsCorrectSchedule()
//        {
//            // Arrange
//            var loan = new Loan
//            {
//                LoanId = Guid.NewGuid(),
//                LoanAmount = 10000000,
//                InterestRate = 3,
//                LoanTermYears = 30,
//                ApplicationDate = new DateTime(2023, 1, 1)
//            };

//            // Act
//            var schedule = _calculator.GenerateSchedule(loan);

//            // Assert
//            Assert.That(schedule, Has.Count.EqualTo(360));
//            Assert.That(schedule[359].RemainingBalance, Is.EqualTo(0));
//        }

//        [Test]
//        public void GenerateSchedule_SmallAmount_ReturnsCorrectSchedule()
//        {
//            // Arrange
//            var loan = new Loan
//            {
//                LoanId = Guid.NewGuid(),
//                LoanAmount = 1000,
//                InterestRate = 5,
//                LoanTermYears = 1,
//                ApplicationDate = new DateTime(2023, 1, 1)
//            };

//            // Act
//            var schedule = _calculator.GenerateSchedule(loan);

//            // Assert
//            Assert.That(schedule, Has.Count.EqualTo(12));
//            Assert.That(schedule[11].RemainingBalance, Is.EqualTo(0));
//        }

//        [Test]
//        public void GenerateSchedule_FutureApplicationDate_ReturnsCorrectSchedule()
//        {
//            // Arrange
//            var futureDate = DateTime.Now.AddYears(1);
//            var loan = new Loan
//            {
//                LoanId = Guid.NewGuid(),
//                LoanAmount = 200000,
//                InterestRate = 5,
//                LoanTermYears = 30,
//                ApplicationDate = futureDate
//            };

//            // Act
//            var schedule = _calculator.GenerateSchedule(loan);

//            // Assert
//            Assert.That(schedule[0].PaymentDate, Is.EqualTo(futureDate.AddMonths(1)));
//            Assert.That(schedule[359].PaymentDate, Is.EqualTo(futureDate.AddMonths(360)));
//        }

//        [Test]
//        public void GenerateSchedule_PastApplicationDate_ReturnsCorrectSchedule()
//        {
//            // Arrange
//            var pastDate = DateTime.Now.AddYears(-1);
//            var loan = new Loan
//            {
//                LoanId = Guid.NewGuid(),
//                LoanAmount = 200000,
//                InterestRate = 5,
//                LoanTermYears = 30,
//                ApplicationDate = pastDate
//            };

//            // Act
//            var schedule = _calculator.GenerateSchedule(loan);

//            // Assert
//            Assert.That(schedule[0].PaymentDate, Is.EqualTo(pastDate.AddMonths(1)));
//            Assert.That(schedule[359].PaymentDate, Is.EqualTo(pastDate.AddMonths(360)));
//        }
//    }
//}
