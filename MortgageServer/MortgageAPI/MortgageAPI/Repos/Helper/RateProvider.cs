using ClosedXML.Excel;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos.Helper.Interface;
using System.Globalization;

namespace MortgageAPI.Repos.Helper
{
    public class RateProvider : IRateProvider
    {
        private readonly string _freddieMacPath;
        private readonly string _sofrPath;

        private List<(DateTime date, decimal rate, string term)> _freddieRates = new();
        private List<(DateTime date, decimal rate)> _sofrRates = new();

        public RateProvider(string freddieMacPath, string sofrPath)
        {
            _freddieMacPath = freddieMacPath;
            _sofrPath = sofrPath;

            LoadFreddieMacRates();
            LoadSofrRates();
        }

        private void LoadFreddieMacRates()
        {
            using var workbook = new XLWorkbook(_freddieMacPath);
            var sheet = workbook.Worksheet("result");

            foreach (var row in sheet.RowsUsed().Skip(1))
            {
                var weekStr = row.Cell("A").GetString();
                if (!DateTime.TryParseExact(weekStr, "MM/dd/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
                    continue;

                if (decimal.TryParse(row.Cell("B").GetString(), out var rate30))
                    _freddieRates.Add((date, rate30, "30-Year FRM"));

                if (decimal.TryParse(row.Cell("C").GetString(), out var rate15))
                    _freddieRates.Add((date, rate15, "15-YearFRM"));
            }
        }

        private void LoadSofrRates()
        {
            using var workbook = new XLWorkbook(_sofrPath);
            var sheet = workbook.Worksheet("Results");

            foreach (var row in sheet.RowsUsed().Skip(1))
            {
                var dateStr = row.Cell("A").GetString();
                var rateStr = row.Cell("B").GetString();

                if (DateTime.TryParse(dateStr, out var date) &&
                    decimal.TryParse(rateStr, out var rate))
                {
                    _sofrRates.Add((date, rate));
                }
            }

            _sofrRates = _sofrRates.OrderBy(r => r.date).ToList();
        }

        public decimal GetInitialRateForFixed(int termYears, DateTime applicationDate)
        {
            var termLabel = termYears switch
            {
                30 => "30-Year FRM",
                15 => "15-YearFRM",
                _ => throw new ArgumentException("Unsupported fixed term")
            };

            var match = _freddieRates
                .Where(r => r.term == termLabel && r.date <= applicationDate)
                .OrderByDescending(r => r.date)
                .FirstOrDefault();

            if (match == default)
                throw new InvalidOperationException("No matching Freddie Mac rate found.");

            return match.rate;
        }

        public List<decimal> GetRatesForARM(Loan loan)
        {
            if (loan.LoanProduct.Type != LoanType.ARM)
                throw new InvalidOperationException("Loan is not ARM");

            int totalMonths = loan.LoanTermYears * 12;

            // Get the most recent SOFR rate at or before application date
            var applicableRates = _sofrRates
                .Where(r => r.date <= loan.ApplicationDate)
                .OrderByDescending(r => r.date)
                .ToList();

            if (applicableRates.Count == 0)
                throw new InvalidOperationException("No SOFR rate found for the loan start date.");

            var initialRate = applicableRates.First().rate + (loan.LoanProduct.InitialRateMargin ?? 0m);

            var rates = new List<decimal>();

            // First period: fixed intro rate
            int fixedMonths = (loan.LoanProduct.FixedRatePeriodYears ?? 0) * 12;
            for (int i = 0; i < fixedMonths && i < totalMonths; i++)
            {
                rates.Add(initialRate);
            }

            // Remaining periods: adjust every X months
            int adjustEvery = loan.LoanProduct.AdjustmentFrequencyMonths ?? 12;
            int currentMonth = fixedMonths;
            int rateIndex = 0;

            while (currentMonth < totalMonths)
            {
                decimal adjustedRate;
                if (rateIndex < _sofrRates.Count)
                {
                    adjustedRate = _sofrRates[rateIndex].rate + (loan.LoanProduct.InitialRateMargin ?? 0m);
                    rateIndex++;
                }
                else
                {
                    adjustedRate = rates.Last(); // use last known rate
                }

                for (int i = 0; i < adjustEvery && currentMonth < totalMonths; i++, currentMonth++)
                {
                    rates.Add(adjustedRate);
                }
            }

            return rates;
        }
    }
}
