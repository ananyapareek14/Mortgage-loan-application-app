using MortgageAPI.Models.Domain;

namespace MortgageAPI.Repos.Helper
{
    public class AmortizationCalculator : IAmortizationCalculator
    {
        public List<AmortizationSchedule> GenerateSchedule(Loan loan)
        {
            var schedule = new List<AmortizationSchedule>();
            decimal monthlyRate = loan.InterestRate / 100 / 12;
            int months = loan.LoanTermYears * 12;
            decimal monthlyPayment = loan.LoanAmount * (monthlyRate * (decimal)Math.Pow((1 + (double)monthlyRate), months)) /
                                     ((decimal)Math.Pow((1 + (double)monthlyRate), months) - 1);
            decimal balance = loan.LoanAmount;

            for (int i = 1; i <= months; i++)
            {
                decimal interest = Math.Round(balance * monthlyRate, 2);
                decimal principal = Math.Round(monthlyPayment - interest, 2);

                // Ensure the final payment fully clears the balance
                if (i == months)
                {
                    principal = balance;
                    balance = 0;
                }
                else
                {
                    balance = Math.Round(balance - principal, 2);
                }

                schedule.Add(new AmortizationSchedule
                {
                    Id = Guid.NewGuid(),
                    LoanId = loan.LoanId,
                    PaymentNumber = i,
                    PaymentDate = loan.ApplicationDate.AddMonths(i),
                    MonthlyPayment = monthlyPayment,
                    PrincipalPayment = principal,
                    InterestPayment = interest,
                    RemainingBalance = balance
                });
            }

            return schedule;
        }
    }
}