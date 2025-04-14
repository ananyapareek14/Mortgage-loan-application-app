using Microsoft.Extensions.Configuration;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos;

namespace MortgageAPITest.Repos
{
    public class TokenServiceTests
    {
        private IConfiguration _configuration;
        private TokenService _tokenService;

        [SetUp]
        public void Setup()
        {
            var inMemorySettings = new Dictionary<string, string> {
                {"JwtSettings:Key", "ThisIsASecretKeyForJwtTestingPurposes"},
                {"JwtSettings:Issuer", "TestIssuer"},
                {"JwtSettings:Audience", "TestAudience"},
                {"JwtSettings:ExpiryMinutes", "60"}
            };

            _configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings!)
                .Build();

            _tokenService = new TokenService(_configuration);
        }

        [Test]
        public void GenerateToken_ValidUser_ReturnsToken()
        {
            var user = new User
            {
                userId = Guid.NewGuid(),
                Username = "testuser",
                Role = "User"
            };

            var token = _tokenService.GenerateToken(user);

            Assert.IsNotNull(token);
            Assert.That(token, Is.Not.Empty);
        }
    }
}
