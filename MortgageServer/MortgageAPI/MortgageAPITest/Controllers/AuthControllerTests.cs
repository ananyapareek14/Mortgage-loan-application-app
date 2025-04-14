using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using MortgageAPI.Controllers;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPITest.Controllers
{
    public class AuthControllerTests
    {
        private Mock<IAuthService> _authServiceMock = null!;
        private Mock<IUserRepository> _userRepoMock = null!;
        private Mock<IMapper> _mapperMock = null!;
        private Mock<ILogger<AuthController>> _loggerMock = null!;
        private AuthController _controller = null!;

        [SetUp]
        public void Setup()
        {
            _authServiceMock = new Mock<IAuthService>();
            _userRepoMock = new Mock<IUserRepository>();
            _mapperMock = new Mock<IMapper>();
            _loggerMock = new Mock<ILogger<AuthController>>();

            _controller = new AuthController(_authServiceMock.Object, _userRepoMock.Object, _mapperMock.Object, _loggerMock.Object);
        }

        [Test]
        public async Task Login_ValidCredentials_ReturnsOkWithToken()
        {
            var request = new LoginRequest { username = "test", password = "pass" };
            _authServiceMock.Setup(x => x.AuthenticateAsync("test", "pass")).ReturnsAsync("mocktoken");

            var result = await _controller.Login(request) as OkObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task Login_InvalidCredentials_ReturnsUnauthorized()
        {
            var request = new LoginRequest { username = "bad", password = "pass" };
            _authServiceMock.Setup(x => x.AuthenticateAsync("bad", "pass")).ReturnsAsync((string?)null);

            var result = await _controller.Login(request);

            Assert.IsInstanceOf<UnauthorizedObjectResult>(result);
        }

        [Test]
        public async Task AddUser_UsernameTaken_ReturnsBadRequest()
        {
            var request = new RegisterRequest { username = "existing", password = "pass", role = "User" };
            _userRepoMock.Setup(x => x.GetUserByUsernameAsync("existing")).ReturnsAsync(new User());

            var result = await _controller.AddUser(request);

            Assert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task AddUser_InvalidRole_ReturnsBadRequest()
        {
            var request = new RegisterRequest { username = "new", password = "pass", role = "InvalidRole" };
            _userRepoMock.Setup(x => x.GetUserByUsernameAsync("new")).ReturnsAsync((User?)null);

            var result = await _controller.AddUser(request);

            Assert.IsInstanceOf<BadRequestObjectResult>(result);
        }
    }
}
