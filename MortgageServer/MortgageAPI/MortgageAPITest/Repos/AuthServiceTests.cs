using Moq;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos.Interfaces;
using MortgageAPI.Repos;

namespace MortgageAPITest.Repos
{
    public class AuthServiceTests
    {
        private Mock<IUserRepository> _userRepositoryMock = null!;
        private Mock<ITokenService> _tokenServiceMock = null!;
        private AuthService _authService = null!;

        [SetUp]
        public void Setup()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _tokenServiceMock = new Mock<ITokenService>();
            _authService = new AuthService(_userRepositoryMock.Object, _tokenServiceMock.Object);
        }

        [Test]
        public async Task AuthenticateAsync_ValidCredentials_ReturnsToken()
        {
            var user = new User { Username = "valid", PasswordHash = "hashed", Role = "User" };
            _userRepositoryMock.Setup(r => r.AuthenticateUserAsync("valid", "password")).ReturnsAsync(user);
            _tokenServiceMock.Setup(t => t.GenerateToken(user)).Returns("mocktoken");

            var token = await _authService.AuthenticateAsync("valid", "password");

            Assert.That(token, Is.EqualTo("mocktoken"));
        }

        [Test]
        public async Task AuthenticateAsync_InvalidCredentials_ReturnsNull()
        {
            _userRepositoryMock.Setup(r => r.AuthenticateUserAsync("invalid", "password")).ReturnsAsync((User?)null);

            var token = await _authService.AuthenticateAsync("invalid", "password");

            Assert.IsNull(token);
        }
    }
}
