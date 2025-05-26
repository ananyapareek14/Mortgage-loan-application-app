using Moq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MortgageAPI.Controllers;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;
using MortgageAPI.Models.Domain;

namespace MortgageAPITest.Controllers;

[TestFixture]
public class CalculatorControllerTests
{
    private Mock<ICalculatorRepository> _mockCalculator;
    private Mock<IMapper> _mockMapper;
    private Mock<ILogger<CalculatorController>> _mockLogger;
    private CalculatorController _controller;

    [SetUp]
    public void Setup()
    {
        _mockCalculator = new Mock<ICalculatorRepository>();
        _mockMapper = new Mock<IMapper>();
        _mockLogger = new Mock<ILogger<CalculatorController>>();
        _controller = new CalculatorController(_mockCalculator.Object, _mockMapper.Object, _mockLogger.Object);
    }

    [Test]
    public void CalculateAffordability_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var request = new AffordabilityCalculationRequest();
        var expectedResult = new AffordabilityCalculationResult();
        _mockCalculator.Setup(c => c.CalculateAffordability(request)).Returns(expectedResult);

        // Act
        var result = _controller.CalculateAffordability(request);

        // Assert
        Assert.IsInstanceOf<OkObjectResult>(result.Result);
        Assert.AreEqual(expectedResult, ((OkObjectResult)result.Result).Value);
    }

    [Test]
    public void CalculateAffordability_InvalidRequest_ReturnsBadRequest()
    {
        // Arrange
        var request = new AffordabilityCalculationRequest();
        _mockCalculator.Setup(c => c.CalculateAffordability(request)).Throws(new ArgumentException("Invalid input"));

        // Act
        var result = _controller.CalculateAffordability(request);

        // Assert
        Assert.IsInstanceOf<BadRequestObjectResult>(result.Result);
        Assert.AreEqual("Invalid input", ((BadRequestObjectResult)result.Result).Value);
    }

    [Test]
    public void CalculateDti_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var request = new DtiCalculationRequest { AnnualIncome = 50000 };
        var expectedResult = new DtiCalculationResult();
        _mockCalculator.Setup(c => c.CalculateDti(request)).Returns(expectedResult);

        // Act
        var result = _controller.CalculateDti(request);

        // Assert
        Assert.IsInstanceOf<OkObjectResult>(result.Result);
        Assert.AreEqual(expectedResult, ((OkObjectResult)result.Result).Value);
    }

    [Test]
    public void CalculateDti_ZeroAnnualIncome_ReturnsBadRequest()
    {
        // Arrange
        var request = new DtiCalculationRequest { AnnualIncome = 0 };

        // Act
        var result = _controller.CalculateDti(request);

        // Assert
        Assert.IsInstanceOf<BadRequestObjectResult>(result.Result);
        Assert.AreEqual("Annual income must be greater than zero.", ((BadRequestObjectResult)result.Result).Value);
    }

    [Test]
    public void CalculateRefinance_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var request = new RefinanceCalculationRequest();
        var expectedResult = new RefinanceCalculationResult();
        _mockCalculator.Setup(c => c.CalculateRefinance(request)).Returns(expectedResult);

        // Act
        var result = _controller.CalculateRefinance(request);

        // Assert
        Assert.IsInstanceOf<OkObjectResult>(result.Result);
        Assert.AreEqual(expectedResult, ((OkObjectResult)result.Result).Value);
    }

    [Test]
    public void CalculateRefinance_ExceptionThrown_ReturnsBadRequest()
    {
        // Arrange
        var request = new RefinanceCalculationRequest();
        _mockCalculator.Setup(c => c.CalculateRefinance(request)).Throws(new Exception("Calculation error"));

        // Act
        var result = _controller.CalculateRefinance(request);

        // Assert
        Assert.IsInstanceOf<BadRequestObjectResult>(result.Result);
        Assert.AreEqual("Error: Calculation error", ((BadRequestObjectResult)result.Result).Value);
    }

    [Test]
    public void CalculateSchedule_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var request = new VaMortgageCalculationRequest { HomePrice = 200000, LoanTermYears = 30, InterestRate = 3.5M };
        var expectedSchedule = new List<VaMortgageScheduleResponse>
    {
        new VaMortgageScheduleResponse
        {
            MonthNumber = 1,
            MonthlyPayment = 1000,
            PrincipalPayment = 700,
            InterestPayment = 300,
            RemainingBalance = 199000
        }
    };
        _mockCalculator.Setup(c => c.CalculateSchedule(request)).Returns(expectedSchedule);

        // Act
        var result = _controller.CalculateSchedule(request);

        // Assert
        Assert.IsInstanceOf<OkObjectResult>(result);
        Assert.AreEqual(expectedSchedule, ((OkObjectResult)result).Value);
    }

    [Test]
    public void CalculateSchedule_InvalidRequest_ReturnsBadRequest()
    {
        // Arrange
        var request = new VaMortgageCalculationRequest { HomePrice = 0, LoanTermYears = 30, InterestRate = 3.5M };

        // Act
        var result = _controller.CalculateSchedule(request);

        // Assert
        Assert.IsInstanceOf<BadRequestObjectResult>(result);
        Assert.AreEqual("Invalid input. Please ensure all fields are positive numbers.", ((BadRequestObjectResult)result).Value);
    }

    [Test]
    public async Task CalculateAmortization_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var request = new LoanRequest
        {
            LoanAmount = 200000,
            LoanTermYears = 30,
            InterestRate = 3.5M
        };

        var schedule = new List<AmortizationSchedule>
    {
        new AmortizationSchedule
        {
            PaymentNumber = 1,
            PaymentDate = new DateTime(2025, 6, 1),
            MonthlyPayment = 1000,
            PrincipalPayment = 700,
            InterestPayment = 300,
            RemainingBalance = 199000
        }
    };

        var scheduleDto = new List<AmortizationScheduleDto>
    {
        new AmortizationScheduleDto
        {
            PaymentNumber = 1,
            PaymentDate = new DateTime(2025, 6, 1),
            MonthlyPayment = 1000,
            PrincipalPayment = 700,
            InterestPayment = 300,
            RemainingBalance = 199000
        }
    };

        _mockCalculator.Setup(c => c.GenerateAmortizationScheduleAsync(request))
            .ReturnsAsync(schedule);

        _mockMapper.Setup(m => m.Map<IEnumerable<AmortizationScheduleDto>>(schedule))
            .Returns(scheduleDto);

        // Act
        var result = await _controller.CalculateAmortization(request);

        // Assert
        Assert.IsInstanceOf<OkObjectResult>(result);
        Assert.AreEqual(scheduleDto, ((OkObjectResult)result).Value);
    }

    [Test]
    public async Task CalculateAmortization_InvalidRequest_ReturnsBadRequest()
    {
        // Arrange
        var request = new LoanRequest { LoanAmount = 0, LoanTermYears = 30, InterestRate = 3.5M };

        // Act
        var result = await _controller.CalculateAmortization(request);

        // Assert
        Assert.IsInstanceOf<BadRequestObjectResult>(result);
        Assert.AreEqual("Invalid loan details. Ensure all values are greater than zero.", ((BadRequestObjectResult)result).Value);
    }
}