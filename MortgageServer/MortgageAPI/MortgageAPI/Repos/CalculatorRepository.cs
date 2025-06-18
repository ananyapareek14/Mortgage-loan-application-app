using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Helper.Interface;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPI.Repos
{
    public class CalculatorRepository : ICalculatorRepository
    {
        private readonly IAmortizationCalculator _amortizationCalculator;

        public CalculatorRepository(IAmortizationCalculator amortizationCalculator)
        {
            _amortizationCalculator = amortizationCalculator;
        }

        public AffordabilityCalculationResult CalculateAffordability(AffordabilityCalculationRequest request)
        {
            // Apply defaults if values are missing
            int loanTermMonths = request.LoanTermMonths > 0 ? request.LoanTermMonths : 120;
            decimal interestRate = request.InterestRate > 0 ? request.InterestRate : 6.5m;
            decimal dtiLimit = request.DesiredDTIPercentage > 0 ? request.DesiredDTIPercentage : 36;

            if (request.AnnualIncome <= 0)
                throw new ArgumentException("Annual income must be greater than zero.");

            decimal monthlyIncome = request.AnnualIncome / 12;
            decimal maxAllowedPayment = (monthlyIncome * dtiLimit / 100) - request.MonthlyDebts;
            int loanTermYears = loanTermMonths / 12;

            decimal monthlyInterestRate = interestRate / 100 / 12;
            int totalPayments = loanTermYears * 12;

            // Calculate loan amount from payment using mortgage formula
            double r = (double)monthlyInterestRate;
            double n = totalPayments;
            double multiplier = Math.Pow(1 + r, n);
            decimal loanAmount = maxAllowedPayment * (decimal)((multiplier - 1) / (r * multiplier));

            decimal homePrice = loanAmount + request.DownPayment;

            var result = new AffordabilityCalculationResult
            {
                MaxAffordableHomePrice = Math.Round(homePrice, 2),
                EstimatedLoanAmount = Math.Round(loanAmount, 2),
                EstimatedMonthlyPayment = Math.Round(maxAllowedPayment, 2),
                DtiPercentage = Math.Round((maxAllowedPayment + request.MonthlyDebts) / monthlyIncome * 100, 2),
                AnnualIncome = request.AnnualIncome,
                DownPayment = request.DownPayment,
                LoanTermMonths = loanTermMonths,
                InterestRate = interestRate,
                MonthlyDebts = request.MonthlyDebts
            };
            return result;
        }

        public RefinanceCalculationResult CalculateRefinance(RefinanceCalculationRequest request)
        {
            int currentYear = DateTime.UtcNow.Year;
            int yearsElapsed = currentYear - request.OriginationYear;
            int remainingTerm = request.CurrentTermMonths - (yearsElapsed * 12);
            remainingTerm = Math.Max(remainingTerm, 0);

            decimal currentMonthlyPayment = CalculateMonthlyPayment(
                request.CurrentLoanAmount, request.InterestRate, request.CurrentTermMonths);

            decimal newMonthlyPayment = CalculateMonthlyPayment(
                request.NewLoanAmount, request.NewInterestRate, request.NewTermMonths);

            decimal monthlySavings = Math.Round(currentMonthlyPayment - newMonthlyPayment, 2);

            decimal currentTotalCost = currentMonthlyPayment * remainingTerm;
            decimal newTotalCost = newMonthlyPayment * request.NewTermMonths + request.RefinanceFees;

            decimal lifetimeSavings = Math.Round(currentTotalCost - newTotalCost, 2);

            int breakEvenMonths = monthlySavings > 0
                ? (int)Math.Ceiling(request.RefinanceFees / monthlySavings)
                : 0;

            return new RefinanceCalculationResult
            {
                MonthlySavings = monthlySavings,
                NewPayment = Math.Round(newMonthlyPayment, 2),
                BreakEvenMonths = breakEvenMonths,
                LifetimeSavings = lifetimeSavings
            };
        }

        private decimal CalculateMonthlyPayment(decimal loanAmount, decimal interestRate, int termMonths)
        {
            if (loanAmount <= 0 || interestRate <= 0 || termMonths <= 0)
                return 0;

            decimal monthlyRate = interestRate / 100 / 12;
            double r = (double)monthlyRate;
            double n = termMonths;

            double payment = (double)loanAmount * r * Math.Pow(1 + r, n) / (Math.Pow(1 + r, n) - 1);
            return (decimal)payment;
        }

        public DtiCalculationResult CalculateDti(DtiCalculationRequest request)
        {
            if (request.AnnualIncome <= 0)
                throw new ArgumentException("Annual income must be greater than zero.");

            decimal monthlyIncome = request.AnnualIncome / 12;

            decimal totalDebts = request.MinCreditCardPayments +
                                 request.CarLoanPayments +
                                 request.StudentLoanPayments;

            // Use default mortgage payment for 36% DTI if not provided or flagged
            decimal proposedMonthlyPayment;

            if (request.CalculateDefaultPayment || request.ProposedMonthlyPayment <= 0)
            {
                proposedMonthlyPayment = monthlyIncome * 0.36m;
            }
            else
            {
                proposedMonthlyPayment = request.ProposedMonthlyPayment;
            }

            var result = new DtiCalculationResult
            {
                DtiPercentage = Math.Round((proposedMonthlyPayment / monthlyIncome) * 100, 2),
                TotalDebts = Math.Round(totalDebts, 2),
                ProposedMonthlyPayment = Math.Round(proposedMonthlyPayment, 2),
                RemainingMonthlyIncome = Math.Round(monthlyIncome - (totalDebts + proposedMonthlyPayment), 2)
            };
            return result;
        }

        public List<VaMortgageScheduleResponse> CalculateSchedule(VaMortgageCalculationRequest request)
        {
            decimal loanAmount = request.HomePrice - request.DownPayment;
            int totalMonths = request.LoanTermYears * 12;
            decimal monthlyInterestRate = request.InterestRate / 100 / 12;

            // Monthly Payment calculation
            decimal monthlyPayment = loanAmount * monthlyInterestRate /
                (1 - (decimal)Math.Pow(1 + (double)monthlyInterestRate, -totalMonths));

            var schedule = new List<VaMortgageScheduleResponse>();
            decimal remainingBalance = loanAmount;

            for (int month = 1; month <= totalMonths; month++)
            {
                decimal interestPayment = Math.Round(remainingBalance * monthlyInterestRate, 2);
                decimal principalPayment = Math.Round(monthlyPayment - interestPayment, 2);
                remainingBalance = Math.Round(remainingBalance - principalPayment, 2);

                if (month == totalMonths && remainingBalance != 0)
                {
                    // Last month adjustment
                    principalPayment += remainingBalance;
                    monthlyPayment = principalPayment + interestPayment;
                    remainingBalance = 0;
                }

                schedule.Add(new VaMortgageScheduleResponse
                {
                    MonthNumber = month,
                    MonthlyPayment = Math.Round(monthlyPayment, 2),
                    PrincipalPayment = principalPayment,
                    InterestPayment = interestPayment,
                    RemainingBalance = remainingBalance
                });
            }

            return schedule;
        }

        public async Task<List<AmortizationSchedule>> GenerateAmortizationScheduleAsync(LoanRequest loanRequest)
        {
            var loan = new Loan
            {
                LoanAmount = loanRequest.LoanAmount,
                InterestRate = loanRequest.InterestRate,
                LoanTermYears = loanRequest.LoanTermYears,
                ApplicationDate = DateTime.UtcNow // Temporary date for calculation
            };

            // Using the amortization calculator to generate the schedule
            return await Task.FromResult(_amortizationCalculator.GenerateSchedule(loan));
        }
    }
}