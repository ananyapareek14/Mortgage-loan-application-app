using NUnit.Framework;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos.Helper;
using System;
using System.Collections.Generic;
using System.Linq;


namespace MortgageAPITest.Repos.Helper
{
    public class AmortizationCalculatorTests
    {
        private AmortizationCalculator _calculator;

        [SetUp]
        public void Setup()
        {
            _calculator = new AmortizationCalculator();
        }

        [Test]
        public void GenerateSchedule_ShouldReturnCorrectNumberOfPayments()
        {
            // Arrange
            var loan = new Loan
            {
                LoanId = Guid.NewGuid(),
                LoanAmount = 120000m,
                InterestRate = 6.0m, // 6% annual interest
                LoanTermYears = 10,
                ApplicationDate = new DateTime(2025, 1, 1)
            };

            // Act
            var schedule = _calculator.GenerateSchedule(loan);

            // Assert
            Assert.That(schedule.Count, Is.EqualTo(120), "Should have 120 monthly payments");
            Assert.That(schedule.First().PaymentNumber, Is.EqualTo(1));
            Assert.That(schedule.Last().PaymentNumber, Is.EqualTo(120));
            Assert.That(schedule.Last().RemainingBalance, Is.EqualTo(0).Within(0.01m));
        }

        [Test]
        public void GenerateSchedule_ShouldCalculateDecreasingBalance()
        {
            // Arrange
            var loan = new Loan
            {
                LoanId = Guid.NewGuid(),
                LoanAmount = 100000m,
                InterestRate = 5.0m,
                LoanTermYears = 5,
                ApplicationDate = DateTime.UtcNow
            };

            // Act
            var schedule = _calculator.GenerateSchedule(loan).ToList();

            // Assert
            for (int i = 1; i < schedule.Count; i++)
            {
                Assert.Less(schedule[i].RemainingBalance, schedule[i - 1].RemainingBalance, $"Remaining balance should decrease on payment #{i + 1}");
            }
        }
    }
}
