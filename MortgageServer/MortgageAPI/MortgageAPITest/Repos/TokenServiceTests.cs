using NUnit.Framework;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using Moq;

namespace MortgageAPITest.Repos
{
    [TestFixture]
    public class TokenServiceTests
    {
        private Mock<IConfiguration> _mockConfiguration;
        private TokenService _tokenService;

        [SetUp]
        public void Setup()
        {
            _mockConfiguration = new Mock<IConfiguration>();
            _mockConfiguration.Setup(c => c["JwtSettings:Key"]).Returns("ThisIsAVeryLongSecretKeyForTesting");
            _mockConfiguration.Setup(c => c["JwtSettings:ExpiryMinutes"]).Returns("30");
            _mockConfiguration.Setup(c => c["JwtSettings:Issuer"]).Returns("TestIssuer");
            _mockConfiguration.Setup(c => c["JwtSettings:Audience"]).Returns("TestAudience");

            _tokenService = new TokenService(_mockConfiguration.Object);
        }

        [Test]
        public void GenerateToken_ValidUser_ReturnsValidToken()
        {
            // Arrange
            var user = new User { userId = new Guid(), Username = "testuser", Role = "User" };

            // Act
            var token = _tokenService.GenerateToken(user);

            // Assert
            Assert.IsNotNull(token);
            Assert.IsNotEmpty(token);

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

            Assert.IsNotNull(jsonToken);
            Assert.That(jsonToken.Issuer, Is.EqualTo("TestIssuer"));
            Assert.That(jsonToken.Audiences.FirstOrDefault(), Is.EqualTo("TestAudience"));
            Assert.IsTrue(jsonToken.ValidTo > DateTime.UtcNow);
            Assert.IsTrue(jsonToken.ValidTo <= DateTime.UtcNow.AddMinutes(30));
        }

        [Test]
        public void GenerateToken_ValidUser_ContainsCorrectClaims()
        {
            // Arrange
            var user = new User { userId = Guid.NewGuid(), Username = "testuser", Role = "Admin" };

            // Act
            var token = _tokenService.GenerateToken(user);

            // Assert
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

            Assert.IsNotNull(jsonToken);

            var claims = jsonToken.Claims.ToList();

            // Optional: Print claims to debug output
            foreach (var claim in claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
            }

            // Compare against short names used in JWTs
            Assert.IsTrue(claims.Any(c => c.Type == "nameid" && c.Value == user.userId.ToString()), "Missing NameIdentifier claim.");
            Assert.IsTrue(claims.Any(c => c.Type == "unique_name" && c.Value == "testuser"), "Missing Name claim.");
            Assert.IsTrue(claims.Any(c => c.Type == "role" && c.Value == "Admin"), "Missing Role claim.");
        }




        [Test]
        public void GenerateToken_UserWithLongUsername_ReturnsValidToken()
        {
            // Arrange
            var user = new User { userId = new Guid(), Username = new string('a', 100), Role = "User" };

            // Act
            var token = _tokenService.GenerateToken(user);

            // Assert
            Assert.IsNotNull(token);
            Assert.IsNotEmpty(token);
        }

        [Test]
        public void GenerateToken_UserWithEmptyRole_DoesNotIncludeRoleClaim()
        {
            // Arrange
            var user = new User { userId = Guid.NewGuid(), Username = "testuser", Role = "" };

            // Act
            var token = _tokenService.GenerateToken(user);

            // Assert
            Assert.IsNotNull(token);
            Assert.IsNotEmpty(token);

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

            Assert.IsFalse(jsonToken.Claims.Any(claim => claim.Type == ClaimTypes.Role));
        }


        [Test]
        public void GenerateToken_NullUser_ThrowsArgumentNullException()
        {
            // Arrange
            User user = null;

            // Act & Assert
            Assert.Throws<NullReferenceException>(() => _tokenService.GenerateToken(user));
        }

        [Test]
        public void GenerateToken_InvalidExpiryMinutes_ThrowsFormatException()
        {
            // Arrange
            var user = new User { userId = new Guid(), Username = "testuser", Role = "User" };
            _mockConfiguration.Setup(c => c["JwtSettings:ExpiryMinutes"]).Returns("invalid");

            // Act & Assert
            Assert.Throws<FormatException>(() => _tokenService.GenerateToken(user));
        }

        [Test]
        public void GenerateToken_MissingJwtKey_ThrowsArgumentException()
        {
            // Arrange
            var user = new User { userId = new Guid(), Username = "testuser", Role = "User" };
            _mockConfiguration.Setup(c => c["JwtSettings:Key"]).Returns((string)null);

            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => _tokenService.GenerateToken(user));
        }
    }
}