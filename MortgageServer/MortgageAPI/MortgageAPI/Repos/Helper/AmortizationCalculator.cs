//using MortgageAPI.Models.Domain;

//namespace MortgageAPI.Repos.Helper
//{
//    public class AmortizationCalculator : IAmortizationCalculator
//    {
//        public List<AmortizationSchedule> GenerateSchedule(Loan loan)
//        {
//            var schedule = new List<AmortizationSchedule>();
//            decimal monthlyRate = loan.InterestRate / 100 / 12;
//            int months = loan.LoanTermYears * 12;
//            decimal monthlyPayment = loan.LoanAmount * (monthlyRate * (decimal)Math.Pow(
//                (1 + (double)monthlyRate), months)) /
//                ((decimal)Math.Pow((1 + (double)monthlyRate), months) - 1);
//            decimal balance = loan.LoanAmount;

//            for (int i = 1; i <= months; i++)
//            {
//                decimal interest = Math.Round(balance * monthlyRate, 2);
//                decimal principal = Math.Round(monthlyPayment - interest, 2);

//                // Ensure the final payment fully clears the balance
//                if (i == months)
//                {
//                    principal = balance;
//                    balance = 0;
//                }
//                else
//                {
//                    balance = Math.Round(balance - principal, 2);
//                }

//                schedule.Add(new AmortizationSchedule
//                {
//                    Id = Guid.NewGuid(),
//                    LoanId = loan.LoanId,
//                    PaymentNumber = i,
//                    PaymentDate = loan.ApplicationDate.AddMonths(i),
//                    MonthlyPayment = monthlyPayment,
//                    PrincipalPayment = principal,
//                    InterestPayment = interest,
//                    RemainingBalance = balance
//                });
//            }

//            return schedule;
//        }
//    }
//}



//using MortgageAPI.Models.Domain;
//using MortgageAPI.Repos.Helper.Interface;

//namespace MortgageAPI.Repos.Helper
//{
//    public class AmortizationCalculator : IAmortizationCalculator
//    {
//        private readonly IRateProvider _rateProvider;

//        public AmortizationCalculator(IRateProvider rateProvider)
//        {
//            _rateProvider = rateProvider;
//        }

//        public List<AmortizationSchedule> GenerateSchedule(Loan loan)
//        {
//            return loan.LoanProduct.Type switch
//            {
//                LoanType.FixedRate => GenerateFixedRateSchedule(loan),
//                LoanType.ARM => GenerateARMSchedule(loan),
//                _ => throw new InvalidOperationException("Unsupported loan type")
//            };
//        }

//        private List<AmortizationSchedule> GenerateFixedRateSchedule(Loan loan)
//        {
//            loan.InterestRate = _rateProvider.GetInitialRateForFixed(loan.LoanProduct.TermYears, loan.ApplicationDate);
//            return GenerateStandardSchedule(loan, loan.InterestRate);
//        }

//        private List<AmortizationSchedule> GenerateARMSchedule(Loan loan)
//        {
//            var rates = _rateProvider.GetRatesForARM(loan);
//            var schedule = new List<AmortizationSchedule>();
//            int months = loan.LoanTermYears * 12;
//            decimal balance = loan.LoanAmount;
//            DateTime paymentDate = loan.ApplicationDate;

//            for (int i = 0; i < months; i++)
//            {
//                decimal currentRate = rates[Math.Min(i, rates.Count - 1)];
//                decimal monthlyRate = currentRate / 100 / 12;
//                int remainingMonths = months - i;
//                decimal monthlyPayment = balance * (monthlyRate * (decimal)Math.Pow(
//                    (1 + (double)monthlyRate), remainingMonths)) /
//                    ((decimal)Math.Pow((1 + (double)monthlyRate), remainingMonths) - 1);

//                decimal interest = Math.Round(balance * monthlyRate, 2);
//                decimal principal = Math.Round(monthlyPayment - interest, 2);
//                if (i == months - 1) principal = balance;

//                balance = Math.Round(balance - principal, 2);

//                schedule.Add(new AmortizationSchedule
//                {
//                    Id = Guid.NewGuid(),
//                    LoanId = loan.LoanId,
//                    PaymentNumber = i + 1,
//                    PaymentDate = paymentDate.AddMonths(i + 1),
//                    MonthlyPayment = monthlyPayment,
//                    PrincipalPayment = principal,
//                    InterestPayment = interest,
//                    RemainingBalance = balance
//                });
//            }

//            return schedule;
//        }

//        private List<AmortizationSchedule> GenerateStandardSchedule(Loan loan, decimal rate)
//        {
//            var schedule = new List<AmortizationSchedule>();
//            decimal monthlyRate = rate / 100 / 12;
//            int months = loan.LoanTermYears * 12;
//            decimal monthlyPayment = loan.LoanAmount * (monthlyRate * (decimal)Math.Pow(
//                (1 + (double)monthlyRate), months)) /
//                ((decimal)Math.Pow((1 + (double)monthlyRate), months) - 1);
//            decimal balance = loan.LoanAmount;

//            for (int i = 1; i <= months; i++)
//            {
//                decimal interest = Math.Round(balance * monthlyRate, 2);
//                decimal principal = Math.Round(monthlyPayment - interest, 2);
//                if (i == months) principal = balance;

//                balance = Math.Round(balance - principal, 2);

//                schedule.Add(new AmortizationSchedule
//                {
//                    Id = Guid.NewGuid(),
//                    LoanId = loan.LoanId,
//                    PaymentNumber = i,
//                    PaymentDate = loan.ApplicationDate.AddMonths(i),
//                    MonthlyPayment = monthlyPayment,
//                    PrincipalPayment = principal,
//                    InterestPayment = interest,
//                    RemainingBalance = balance
//                });
//            }
//            return schedule;
//        }
//    }
//}



using MortgageAPI.Models.Domain;
using MortgageAPI.Repos.Helper.Interface;

namespace MortgageAPI.Repos.Helper
{
    public class AmortizationCalculator : IAmortizationCalculator
    {
        private readonly IRateProvider _rateProvider;

        public AmortizationCalculator(IRateProvider rateProvider)
        {
            _rateProvider = rateProvider;
        }

        public List<AmortizationSchedule> GenerateSchedule(Loan loan)
        {
            return loan.LoanProduct.Type switch
            {
                LoanType.FixedRate => GenerateFixedRateSchedule(loan),
                LoanType.ARM => GenerateARMSchedule(loan),
                _ => throw new InvalidOperationException("Unsupported loan type")
            };
        }

        private List<AmortizationSchedule> GenerateFixedRateSchedule(Loan loan)
        {
            loan.InterestRate = _rateProvider.GetInitialRateForFixed(
                loan.LoanProduct.TermYears,
                loan.ApplicationDate
            );

            return GenerateStandardSchedule(loan, loan.InterestRate);
        }

        private List<AmortizationSchedule> GenerateARMSchedule(Loan loan)
        {
            var rates = _rateProvider.GetRatesForARM(loan);

            if (rates == null || rates.Count == 0)
                throw new InvalidOperationException("No ARM rates returned.");

            var schedule = new List<AmortizationSchedule>();
            int months = loan.LoanTermYears * 12;
            decimal balance = loan.LoanAmount;
            DateTime paymentDate = loan.ApplicationDate;

            for (int i = 0; i < months; i++)
            {
                decimal currentRate = rates[Math.Min(i, rates.Count - 1)];
                decimal monthlyRate = currentRate / 100 / 12;
                int remainingMonths = months - i;

                decimal monthlyPayment = CalculateMonthlyPayment(balance, monthlyRate, remainingMonths);

                decimal interest = Math.Round(balance * monthlyRate, 2);
                decimal principal = Math.Round(monthlyPayment - interest, 2);
                if (i == months - 1) principal = balance;

                balance = Math.Round(balance - principal, 2);

                schedule.Add(new AmortizationSchedule
                {
                    Id = Guid.NewGuid(),
                    LoanId = loan.LoanId,
                    PaymentNumber = i + 1,
                    PaymentDate = paymentDate.AddMonths(i + 1),
                    MonthlyPayment = monthlyPayment,
                    PrincipalPayment = principal,
                    InterestPayment = interest,
                    RemainingBalance = balance
                });
            }

            return schedule;
        }

        private List<AmortizationSchedule> GenerateStandardSchedule(Loan loan, decimal rate)
        {
            var schedule = new List<AmortizationSchedule>();
            decimal monthlyRate = rate / 100 / 12;
            int months = loan.LoanTermYears * 12;
            decimal balance = loan.LoanAmount;
            decimal monthlyPayment = CalculateMonthlyPayment(balance, monthlyRate, months);

            for (int i = 1; i <= months; i++)
            {
                decimal interest = Math.Round(balance * monthlyRate, 2);
                decimal principal = Math.Round(monthlyPayment - interest, 2);
                if (i == months) principal = balance;

                balance = Math.Round(balance - principal, 2);

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

        private decimal CalculateMonthlyPayment(decimal balance, decimal monthlyRate, int months)
        {
            if (monthlyRate == 0)
                return Math.Round(balance / months, 2);

            return Math.Round(
                balance * (monthlyRate * (decimal)Math.Pow(1 + (double)monthlyRate, months)) /
                ((decimal)Math.Pow(1 + (double)monthlyRate, months) - 1), 2
            );
        }
    }
}
