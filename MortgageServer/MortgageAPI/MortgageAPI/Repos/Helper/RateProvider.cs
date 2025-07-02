//using ClosedXML.Excel;
//using MortgageAPI.Models.Domain;
//using MortgageAPI.Repos.Helper.Interface;
//using System.Globalization;

//namespace MortgageAPI.Repos.Helper
//{
//    public class RateProvider : IRateProvider
//    {
//        private readonly string _freddieMacPath;
//        private readonly string _sofrPath;

//        private List<(DateTime date, decimal rate, string term)> _freddieRates = new();
//        private List<(DateTime date, decimal rate)> _sofrRates = new();

//        public RateProvider(string freddieMacPath, string sofrPath)
//        {
//            if (!File.Exists(freddieMacPath))
//                throw new FileNotFoundException("FreddieMac rates file not found", freddieMacPath);

//            if (!File.Exists(sofrPath))
//                throw new FileNotFoundException("SOFR rates file not found", sofrPath);

//            _freddieMacPath = freddieMacPath;
//            _sofrPath = sofrPath;

//            LoadFreddieMacRates();
//            LoadSofrRates();
//        }

//        private void LoadFreddieMacRates()
//        {
//            using var workbook = new XLWorkbook(_freddieMacPath);
//            var sheet = workbook.Worksheets.FirstOrDefault(s => s.Name.Equals("Results", StringComparison.OrdinalIgnoreCase));

//            if (sheet == null)
//                throw new InvalidOperationException("Sheet 'result' not found in FreddieMac rates file.");

//            foreach (var row in sheet.RowsUsed().Skip(1))
//            {
//                var weekStr = row.Cell("A").GetString().Trim();
//                if (!DateTime.TryParseExact(weekStr, "MM/dd/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
//                    continue;

//                if (decimal.TryParse(row.Cell("B").GetString(), out var rate30))
//                    _freddieRates.Add((date, rate30, "30yr FRM"));

//                if (decimal.TryParse(row.Cell("C").GetString(), out var rate15))
//                    _freddieRates.Add((date, rate15, "15yr FRM"));
//            }
//        }

//        private void LoadSofrRates()
//        {
//            using var workbook = new XLWorkbook(_sofrPath);
//            var sheet = workbook.Worksheets.FirstOrDefault(s => s.Name.Equals("Results", StringComparison.OrdinalIgnoreCase));

//            if (sheet == null)
//                throw new InvalidOperationException("Sheet 'Results' not found in SOFR rates file.");

//            foreach (var row in sheet.RowsUsed().Skip(1))
//            {
//                var dateStr = row.Cell("A").GetString().Trim();
//                var rateStr = row.Cell("B").GetString().Trim();

//                if (DateTime.TryParse(dateStr, out var date) &&
//                    decimal.TryParse(rateStr, out var rate))
//                {
//                    _sofrRates.Add((date, rate));
//                }
//            }

//            _sofrRates = _sofrRates.OrderBy(r => r.date).ToList();
//        }

//        public decimal GetInitialRateForFixed(int termYears, DateTime applicationDate)
//        {
//            var termLabel = termYears switch
//            {
//                30 => "30yr FRM",
//                15 => "15yr FRM",
//                _ => throw new ArgumentException("Unsupported fixed term")
//            };

//            var match = _freddieRates
//                .Where(r => r.term == termLabel && r.date <= applicationDate)
//                .OrderByDescending(r => r.date)
//                .FirstOrDefault();

//            if (match == default)
//                throw new InvalidOperationException("No matching Freddie Mac rate found.");

//            return match.rate;
//        }

//        public List<decimal> GetRatesForARM(Loan loan)
//        {
//            if (loan.LoanProduct.Type != LoanType.ARM)
//                throw new InvalidOperationException("Loan is not ARM");

//            int totalMonths = loan.LoanTermYears * 12;

//            var applicableRates = _sofrRates
//                .Where(r => r.date <= loan.ApplicationDate)
//                .OrderByDescending(r => r.date)
//                .ToList();

//            if (applicableRates.Count == 0)
//                throw new InvalidOperationException("No SOFR rate found for the loan start date.");

//            var initialRate = applicableRates.First().rate + (loan.LoanProduct.InitialRateMargin ?? 0m);

//            var rates = new List<decimal>();

//            // Fixed intro period
//            int fixedMonths = (loan.LoanProduct.FixedRatePeriodYears ?? 0) * 12;
//            for (int i = 0; i < fixedMonths && i < totalMonths; i++)
//            {
//                rates.Add(initialRate);
//            }

//            // Adjustment period
//            int adjustEvery = loan.LoanProduct.AdjustmentFrequencyMonths ?? 12;
//            int currentMonth = fixedMonths;
//            int rateIndex = 0;

//            while (currentMonth < totalMonths)
//            {
//                decimal adjustedRate;
//                if (rateIndex < _sofrRates.Count)
//                {
//                    adjustedRate = _sofrRates[rateIndex].rate + (loan.LoanProduct.InitialRateMargin ?? 0m);
//                    rateIndex++;
//                }
//                else
//                {
//                    adjustedRate = rates.Last(); // Fallback to last known rate
//                }

//                for (int i = 0; i < adjustEvery && currentMonth < totalMonths; i++, currentMonth++)
//                {
//                    rates.Add(adjustedRate);
//                }
//            }

//            return rates;
//        }
//    }
//}


using ClosedXML.Excel;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos.Helper.Interface;
using System.Globalization;

namespace MortgageAPI.Repos.Helper
{
    //public class RateProvider : IRateProvider
    //{
    //    private readonly string _freddieMacPath;
    //    private readonly string _sofrPath;

    //    private List<(DateTime date, decimal rate, string term)> _freddieRates = new();
    //    private List<(DateTime date, decimal rate)> _sofrRates = new();

    //    public RateProvider(string freddieMacPath, string sofrPath)
    //    {
    //        if (!File.Exists(freddieMacPath))
    //            throw new FileNotFoundException("FreddieMac rates file not found", freddieMacPath);

    //        if (!File.Exists(sofrPath))
    //            throw new FileNotFoundException("SOFR rates file not found", sofrPath);

    //        _freddieMacPath = freddieMacPath;
    //        _sofrPath = sofrPath;

    //        LoadFreddieMacRates();
    //        LoadSofrRates();
    //    }

    //    private void LoadFreddieMacRates()
    //    {
    //        using var workbook = new XLWorkbook(_freddieMacPath);
    //        var sheet = workbook.Worksheets.FirstOrDefault(s => s.Name.Equals("result", StringComparison.OrdinalIgnoreCase));
    //        if (sheet == null)
    //            throw new InvalidOperationException("Sheet 'result' not found in FreddieMac rates file.");

    //        foreach (var row in sheet.RowsUsed().Skip(1))
    //        {
    //            var weekStr = row.Cell("A").GetString().Trim();
    //            if (!DateTime.TryParseExact(weekStr, "MM/dd/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
    //                continue;

    //            if (decimal.TryParse(row.Cell("B").GetString(), out var rate30))
    //                _freddieRates.Add((date, rate30, "30-Year FRM"));

    //            if (decimal.TryParse(row.Cell("C").GetString(), out var rate15))
    //                _freddieRates.Add((date, rate15, "15-Year FRM"));
    //        }

    //        Console.WriteLine($"[DEBUG] Loaded Freddie sheet: Rows = {sheet.RowsUsed().Count()}");

    //        foreach (var row in sheet.RowsUsed().Skip(1))
    //        {
    //            var weekStr = row.Cell("A").GetString().Trim();
    //            Console.WriteLine($"[DEBUG] Week: {weekStr}, B: {row.Cell("B").GetString()}, C: {row.Cell("C").GetString()}");
    //        }
    //    }

    //    private void LoadSofrRates()
    //    {
    //        using var workbook = new XLWorkbook(_sofrPath);
    //        var sheet = workbook.Worksheets.FirstOrDefault(s => s.Name.Equals("Results", StringComparison.OrdinalIgnoreCase));
    //        if (sheet == null)
    //            throw new InvalidOperationException("Sheet 'Results' not found in SOFR rates file.");

    //        foreach (var row in sheet.RowsUsed().Skip(1))
    //        {
    //            var dateStr = row.Cell("A").GetString().Trim();
    //            var rateStr = row.Cell("B").GetString().Trim();

    //            if (DateTime.TryParse(dateStr, out var date) &&
    //                decimal.TryParse(rateStr, out var rate))
    //            {
    //                _sofrRates.Add((date, rate));
    //            }
    //        }

    //        _sofrRates = _sofrRates.OrderBy(r => r.date).ToList();

    //        Console.WriteLine($"[DEBUG] Loaded SOFR sheet: Rows = {sheet.RowsUsed().Count()}");

    //        foreach (var row in sheet.RowsUsed().Skip(1))
    //        {
    //            var dateStr = row.Cell("A").GetString().Trim();
    //            var rateStr = row.Cell("B").GetString().Trim();
    //            Console.WriteLine($"[DEBUG] SOFR Row: {dateStr} - {rateStr}");
    //        }
    //    }

    //    public decimal GetInitialRateForFixed(int termYears, DateTime applicationDate)
    //    {
    //        var termLabel = termYears switch
    //        {
    //            30 => "30-Year FRM",
    //            15 => "15-Year FRM",
    //            _ => throw new ArgumentException("Unsupported fixed term")
    //        };

    //        var match = _freddieRates
    //            .Where(r => r.term == termLabel && r.date <= applicationDate)
    //            .OrderByDescending(r => r.date)
    //            .FirstOrDefault();

    //        if (match == default)
    //            throw new InvalidOperationException($"No matching Freddie Mac rate found for {termLabel} on or before {applicationDate:yyyy-MM-dd}");

    //        return match.rate;
    //    }

    //    public List<decimal> GetRatesForARM(Loan loan)
    //    {
    //        if (loan.LoanProduct.Type != LoanType.ARM)
    //            throw new InvalidOperationException("Loan is not ARM");

    //        int totalMonths = loan.LoanTermYears * 12;

    //        var applicableRates = _sofrRates
    //            .Where(r => r.date <= loan.ApplicationDate)
    //            .OrderByDescending(r => r.date)
    //            .ToList();

    //        if (applicableRates.Count == 0)
    //            throw new InvalidOperationException("No SOFR rate found for the loan start date.");

    //        var initialRate = applicableRates.First().rate + (loan.LoanProduct.InitialRateMargin ?? 0m);

    //        var rates = new List<decimal>();

    //        // Fixed intro period
    //        int fixedMonths = (loan.LoanProduct.FixedRatePeriodYears ?? 0) * 12;
    //        for (int i = 0; i < fixedMonths && i < totalMonths; i++)
    //        {
    //            rates.Add(initialRate);
    //        }

    //        // Adjustment period
    //        int adjustEvery = loan.LoanProduct.AdjustmentFrequencyMonths ?? 12;
    //        int currentMonth = fixedMonths;
    //        int rateIndex = 0;

    //        while (currentMonth < totalMonths)
    //        {
    //            decimal adjustedRate;
    //            if (rateIndex < _sofrRates.Count)
    //            {
    //                adjustedRate = _sofrRates[rateIndex].rate + (loan.LoanProduct.InitialRateMargin ?? 0m);
    //                rateIndex++;
    //            }
    //            else
    //            {
    //                adjustedRate = rates.Last(); // Fallback to last known rate
    //            }

    //            for (int i = 0; i < adjustEvery && currentMonth < totalMonths; i++, currentMonth++)
    //            {
    //                rates.Add(adjustedRate);
    //            }
    //        }

    //        return rates;
    //    }
    //}


    public class RateProvider : IRateProvider
    {
        private readonly string _freddieMacPath;
        private readonly string _sofrPath;

        private bool _freddieLoaded = false;
        private bool _sofrLoaded = false;

        private List<(DateTime date, decimal rate, string term)> _freddieRates = new();
        private List<(DateTime date, decimal rate)> _sofrRates = new();

        public RateProvider(string freddieMacPath, string sofrPath)
        {
            _freddieMacPath = freddieMacPath;
            _sofrPath = sofrPath;
        }

        private void EnsureFreddieRatesLoaded()
        {
            if (_freddieLoaded) return;

            using var workbook = new XLWorkbook(_freddieMacPath);
            var sheet = workbook.Worksheets.FirstOrDefault(s => s.Name.Equals("result", StringComparison.OrdinalIgnoreCase));
            if (sheet == null)
                throw new InvalidOperationException("Sheet 'result' not found in FreddieMac file.");

            foreach (var row in sheet.RowsUsed().Skip(1))
            {
                try
                {
                    var cellA = row.Cell("A");
                    DateTime date;

                    // Read native Excel date
                    if (!cellA.TryGetValue(out date))
                    {
                        Console.WriteLine($"[DEBUG] Skipped row with invalid date: A={cellA.Value}");
                        continue;
                    }

                    var cellB = row.Cell("B");
                    var cellC = row.Cell("C");

                    if (decimal.TryParse(cellB.GetString(), out var rate30))
                    {
                        _freddieRates.Add((date, rate30, "30-Year FRM"));
                    }

                    if (decimal.TryParse(cellC.GetString(), out var rate15))
                    {
                        _freddieRates.Add((date, rate15, "15-Year FRM"));
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[ERROR] Exception while parsing row: {ex.Message}");
                }
            }

            Console.WriteLine("==[DEBUG] Final Loaded FreddieMac Rates==");
            foreach (var r in _freddieRates.OrderBy(r => r.date))
            {
                Console.WriteLine($"[DEBUG] {r.term} | {r.date:yyyy-MM-dd} | {r.rate}%");
            }

            _freddieLoaded = true;
        }



        private void EnsureSofrRatesLoaded()
        {
            if (_sofrLoaded) return;

            using var workbook = new XLWorkbook(_sofrPath);
            var sheet = workbook.Worksheets.FirstOrDefault(s => s.Name.Equals("Results", StringComparison.OrdinalIgnoreCase));
            if (sheet == null)
                throw new InvalidOperationException("Sheet 'Results' not found in SOFR file.");

            foreach (var row in sheet.RowsUsed().Skip(1))
            {
                var dateStr = row.Cell("A").GetString().Trim();
                var rateStr = row.Cell("B").GetString().Trim();

                if (DateTime.TryParse(dateStr, out var date) &&
                    decimal.TryParse(rateStr, out var rate))
                {
                    _sofrRates.Add((date, rate));
                }
            }

            _sofrRates = _sofrRates.OrderBy(r => r.date).ToList();
            _sofrLoaded = true;
        }

        public (DateTime date, decimal rate, string term) GetClosestFreddieRate(int termYears, DateTime applicationDate)
        {
            EnsureFreddieRatesLoaded();

            var termLabel = termYears switch
            {
                30 => "30-Year FRM",
                15 => "15-Year FRM",
                _ => throw new ArgumentException("Unsupported fixed term")
            };

            // Try to find a rate on or before the application date
            var closest = _freddieRates
                .Where(r => r.term == termLabel && r.date <= applicationDate)
                .OrderByDescending(r => r.date)
                .Cast<(DateTime date, decimal rate, string term)?>()
                .FirstOrDefault();

            if (closest is not null)
                return closest.Value;

            // Fallback: use latest available
            var fallback = _freddieRates
                .Where(r => r.term == termLabel)
                .OrderByDescending(r => r.date)
                .FirstOrDefault();

            if (fallback.date == default)
                throw new InvalidOperationException($"No Freddie Mac rate found for {termLabel}");

            return fallback;
        }

        public List<(DateTime date, decimal rate)> GetRawSofrRatesUpTo(DateTime applicationDate)
        {
            EnsureSofrRatesLoaded();
            return _sofrRates
                .Where(r => r.date <= applicationDate)
                .OrderByDescending(r => r.date)
                .ToList();
        }
    }
}
