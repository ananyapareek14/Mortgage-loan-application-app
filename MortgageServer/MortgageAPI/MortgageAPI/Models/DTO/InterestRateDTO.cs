namespace MortgageAPI.Models.DTO
{
    //public class InterestRateDto
    //{
    //    public Guid Id { get; set; }
    //    public decimal Rate { get; set; }
    //    public DateTime ValidFrom { get; set; }
    //}

    public class InterestRateDto
    {
        public string Type { get; set; } = default!;
        public decimal InterestRate { get; set; }
        public string ClosestDate { get; set; } = default!;
        public int? TermYears { get; set; }    // optional for ARM
        public string? TermLabel { get; set; } // optional for ARM
        public bool? IsFallback { get; set; }  // optional for ARM
    }

}
