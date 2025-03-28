namespace MortgageAPI.Models.DTO
{
    public class RegisterRequest
    {
        public required string username { get; set; }
        public required string password { get; set; }
        public string? role { get; set; }
    }
}
