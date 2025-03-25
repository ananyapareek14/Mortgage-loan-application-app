namespace MortgageAPI.Models.DTO
{
    public class InterestRateDto
    {
        public Guid Id { get; set; }
        public decimal Rate { get; set; }
        public DateTime ValidFrom { get; set; }
    }
}
