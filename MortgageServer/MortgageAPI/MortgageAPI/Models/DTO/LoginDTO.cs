namespace MortgageAPI.Models.DTO
{
    public class LoginDTO
    {
        public string username { get; set; }
        public string password { get; set; }
    }

    public class LoginResponse
    {
        public string message { get; set; }
        public string token { get; set; }
        public string username { get; set; }
    }
}
