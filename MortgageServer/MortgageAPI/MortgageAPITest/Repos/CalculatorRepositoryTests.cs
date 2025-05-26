using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos;
using MortgageAPI.Repos.Helper;
using Moq;

namespace MortgageAPITest.Repos;

[TestFixture]
public class CalculatorRepositoryTests
{
    private CalculatorRepository _calculatorRepository;
    private Mock<IAmortizationCalculator> _mockAmortizationCalculator;

    [SetUp]
    public void Setup()
    {
        _mockAmortizationCalculator = new Mock<IAmortizationCalculator>();
        _calculatorRepository = new CalculatorRepository(_mockAmortizationCalculator.Object);
    }

    [Test]
    public void CalculateAffordability_NormalScenario_ReturnsCorrectResult()
    {
        // Arrange
        var request = new AffordabilityCalculationRequest
        {
            AnnualIncome = 100000,
            DownPayment = 20000,
            MonthlyDebts = 500,
            LoanTermMonths = 360,
            InterestRate = 3.5m,
            DesiredDTIPercentage = 36
        };

        // Act
        var result = _calculatorRepository.CalculateAffordability(request);

        // Assert
        Assert.That(result.MaxAffordableHomePrice, Is.GreaterThan(0));
        Assert.That(result.EstimatedLoanAmount, Is.GreaterThan(0));
        Assert.That(result.EstimatedMonthlyPayment, Is.GreaterThan(0));
        Assert.That(result.DtiPercentage, Is.EqualTo(36).Within(0.01));
    }

    [Test]
    public void CalculateAffordability_ZeroAnnualIncome_ThrowsArgumentException()
    {
        // Arrange
        var request = new AffordabilityCalculationRequest
        {
            AnnualIncome = 0,
            DownPayment = 20000,
            MonthlyDebts = 500
        };

        // Act & Assert
        Assert.Throws<ArgumentException>(() => _calculatorRepository.CalculateAffordability(request));
    }

    [Test]
    public void CalculateAffordability_DefaultValues_UsesCorrectDefaults()
    {
        // Arrange
        var request = new AffordabilityCalculationRequest
        {
            AnnualIncome = 100000,
            DownPayment = 20000,
            MonthlyDebts = 500
        };

        // Act
        var result = _calculatorRepository.CalculateAffordability(request);

        // Assert
        Assert.That(result.LoanTermMonths, Is.EqualTo(120));
        Assert.That(result.InterestRate, Is.EqualTo(6.5m));
    }

    [Test]
    public void CalculateRefinance_NormalScenario_ReturnsCorrectResult()
    {
        // Arrange
        var request = new RefinanceCalculationRequest
        {
            CurrentLoanAmount = 200000,
            InterestRate = 4.5m,
            CurrentTermMonths = 360,
            NewLoanAmount = 190000,
            NewInterestRate = 3.5m,
            NewTermMonths = 300,
            RefinanceFees = 3000,
            OriginationYear = DateTime.UtcNow.Year - 5
        };

        // Act
        var result = _calculatorRepository.CalculateRefinance(request);

        // Assert
        Assert.That(result.MonthlySavings, Is.GreaterThan(0));
        Assert.That(result.NewPayment, Is.LessThan(request.CurrentLoanAmount));
        Assert.That(result.BreakEvenMonths, Is.GreaterThan(0));
        Assert.That(result.LifetimeSavings, Is.GreaterThan(0));
    }

    [Test]
    public void CalculateRefinance_NoSavings_ReturnsZeroBreakEvenMonths()
    {
        // Arrange
        var request = new RefinanceCalculationRequest
        {
            CurrentLoanAmount = 200000,
            InterestRate = 3.5m,
            CurrentTermMonths = 360,
            NewLoanAmount = 200000,
            NewInterestRate = 3.5m,
            NewTermMonths = 360,
            RefinanceFees = 3000,
            OriginationYear = DateTime.UtcNow.Year - 1
        };

        // Act
        var result = _calculatorRepository.CalculateRefinance(request);

        // Assert
        Assert.That(result.BreakEvenMonths, Is.EqualTo(0));
    }

    [Test]
    public void CalculateDti_NormalScenario_ReturnsCorrectResult()
    {
        // Arrange
        var request = new DtiCalculationRequest
        {
            AnnualIncome = 100000,
            MinCreditCardPayments = 200,
            CarLoanPayments = 300,
            StudentLoanPayments = 400,
            ProposedMonthlyPayment = 1500
        };

        // Act
        var result = _calculatorRepository.CalculateDti(request);

        // Assert
        Assert.That(result.DtiPercentage, Is.EqualTo(18).Within(0.01));
        Assert.That(result.TotalDebts, Is.EqualTo(900));
        Assert.That(result.ProposedMonthlyPayment, Is.EqualTo(1500));
        Assert.That(result.RemainingMonthlyIncome, Is.GreaterThan(0));
    }

    [Test]
    public void CalculateDti_ZeroAnnualIncome_ThrowsArgumentException()
    {
        // Arrange
        var request = new DtiCalculationRequest
        {
            AnnualIncome = 0,
            MinCreditCardPayments = 200,
            CarLoanPayments = 300,
            StudentLoanPayments = 400,
            ProposedMonthlyPayment = 1500
        };

        // Act & Assert
        Assert.Throws<ArgumentException>(() => _calculatorRepository.CalculateDti(request));
    }

    [Test]
    public void CalculateDti_DefaultPaymentCalculation_UsesCorrectDefault()
    {
        // Arrange
        var request = new DtiCalculationRequest
        {
            AnnualIncome = 100000,
            MinCreditCardPayments = 200,
            CarLoanPayments = 300,
            StudentLoanPayments = 400,
            CalculateDefaultPayment = true
        };

        // Act
        var result = _calculatorRepository.CalculateDti(request);

        // Assert
        Assert.That(result.ProposedMonthlyPayment, Is.EqualTo(3000).Within(0.01));
    }

    [Test]
    public void CalculateSchedule_NormalScenario_ReturnsCorrectSchedule()
    {
        // Arrange
        var request = new VaMortgageCalculationRequest
        {
            HomePrice = 300000,
            DownPayment = 60000,
            InterestRate = 3.5m,
            LoanTermYears = 30
        };

        // Act
        var result = _calculatorRepository.CalculateSchedule(request);

        // Assert
        Assert.That(result.Count, Is.EqualTo(360));
        Assert.That(result[0].RemainingBalance, Is.LessThan(240000));
        Assert.That(result[359].RemainingBalance, Is.EqualTo(0));
    }

    [Test]
    public async Task GenerateAmortizationScheduleAsync_WithValidRequest_CallsCalculatorAndReturnsSchedule()
    {
        // Arrange
        var request = new LoanRequest
        {
            LoanAmount = 200000,
            InterestRate = 3.5m,
            LoanTermYears = 30
        };

        var expectedSchedule = new List<AmortizationSchedule>
    {
        new AmortizationSchedule
        {
            PaymentNumber = 1,
            PaymentDate = new DateTime(2025, 6, 1),
            MonthlyPayment = 1000m,
            PrincipalPayment = 700m,
            InterestPayment = 300m,
            RemainingBalance = 199000m
        }
    };

        _mockAmortizationCalculator
            .Setup(x => x.GenerateSchedule(It.Is<Loan>(l =>
                l.LoanAmount == request.LoanAmount &&
                l.InterestRate == request.InterestRate &&
                l.LoanTermYears == request.LoanTermYears)))
            .Returns(expectedSchedule);

        // Act
        var result = await _calculatorRepository.GenerateAmortizationScheduleAsync(request);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Count, Is.EqualTo(expectedSchedule.Count));
        Assert.That(result.First().MonthlyPayment, Is.EqualTo(expectedSchedule.First().MonthlyPayment));
        Assert.That(result.First().RemainingBalance, Is.EqualTo(expectedSchedule.First().RemainingBalance));

        _mockAmortizationCalculator.Verify(x => x.GenerateSchedule(It.IsAny<Loan>()), Times.Once);
    }
}