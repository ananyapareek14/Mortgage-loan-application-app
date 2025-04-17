//using AutoMapper;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Extensions.Logging;
//using Moq;
//using MortgageAPI.Controllers;
//using MortgageAPI.Models.Domain;
//using MortgageAPI.Models.DTO;
//using MortgageAPI.Repos.Interfaces;

//namespace MortgageAPITest.Controllers
//{
//    public class AuthControllerTests
//    {
//        private Mock<IAuthService> _authServiceMock = null!;
//        private Mock<IUserRepository> _userRepoMock = null!;
//        private Mock<IMapper> _mapperMock = null!;
//        private Mock<ILogger<AuthController>> _loggerMock = null!;
//        private AuthController _controller = null!;

//        [SetUp]
//        public void Setup()
//        {
//            _authServiceMock = new Mock<IAuthService>();
//            _userRepoMock = new Mock<IUserRepository>();
//            _mapperMock = new Mock<IMapper>();
//            _loggerMock = new Mock<ILogger<AuthController>>();

//            _controller = new AuthController(_authServiceMock.Object, _userRepoMock.Object, _mapperMock.Object, _loggerMock.Object);
//        }

//        [Test]
//        public async Task Login_ValidCredentials_ReturnsOkWithToken()
//        {
//            var request = new LoginRequest { username = "test", password = "pass" };
//            _authServiceMock.Setup(x => x.AuthenticateAsync("test", "pass")).ReturnsAsync("mocktoken");

//            var result = await _controller.Login(request) as OkObjectResult;

//            Assert.IsNotNull(result);
//            Assert.AreEqual(200, result.StatusCode);
//        }

//        [Test]
//        public async Task Login_InvalidCredentials_ReturnsUnauthorized()
//        {
//            var request = new LoginRequest { username = "bad", password = "pass" };
//            _authServiceMock.Setup(x => x.AuthenticateAsync("bad", "pass")).ReturnsAsync((string?)null);

//            var result = await _controller.Login(request);

//            Assert.IsInstanceOf<UnauthorizedObjectResult>(result);
//        }

//        [Test]
//        public async Task AddUser_UsernameTaken_ReturnsBadRequest()
//        {
//            var request = new RegisterRequest { username = "existing", password = "pass", role = "User" };
//            _userRepoMock.Setup(x => x.GetUserByUsernameAsync("existing")).ReturnsAsync(new User());

//            var result = await _controller.AddUser(request);

//            Assert.IsInstanceOf<BadRequestObjectResult>(result);
//        }

//        [Test]
//        public async Task AddUser_InvalidRole_ReturnsBadRequest()
//        {
//            var request = new RegisterRequest { username = "new", password = "pass", role = "InvalidRole" };
//            _userRepoMock.Setup(x => x.GetUserByUsernameAsync("new")).ReturnsAsync((User?)null);

//            var result = await _controller.AddUser(request);

//            Assert.IsInstanceOf<BadRequestObjectResult>(result);
//        }

//        [Test]
//        public async Task AddUser_NullRole_DefaultsToUser()
//        {
//            var request = new RegisterRequest
//            {
//                username = "user123",
//                password = "pass",
//                role = null // should fallback to "User"
//            };

//            var mappedUser = new User { Username = "user123" };

//            _userRepoMock.Setup(x => x.GetUserByUsernameAsync("user123")).ReturnsAsync((User?)null);
//            _mapperMock.Setup(x => x.Map<User>(request)).Returns(mappedUser);

//            var result = await _controller.AddUser(request);

//            Assert.IsInstanceOf<OkObjectResult>(result);
//            Assert.AreEqual("User", mappedUser.Role);
//        }


//        [Test]
//        public async Task AddUser_ValidRequest_AddsUserAndReturnsOk()
//        {
//            // Arrange
//            var request = new RegisterRequest
//            {
//                username = "newuser",
//                password = "securepass",
//                role = "User"
//            };

//            var mappedUser = new User { Username = "newuser" };

//            _userRepoMock.Setup(x => x.GetUserByUsernameAsync("newuser"))
//                         .ReturnsAsync((User?)null);

//            _mapperMock.Setup(x => x.Map<User>(request))
//                       .Returns(mappedUser);

//            _userRepoMock.Setup(x => x.AddUserAsync(It.IsAny<User>()))
//                         .Returns(Task.CompletedTask);

//            // Act
//            var result = await _controller.AddUser(request);

//            // Assert
//            var okResult = result as OkObjectResult;
//            Assert.IsNotNull(okResult);
//            Assert.AreEqual(200, okResult.StatusCode);

//            _loggerMock.Verify(
//                x => x.Log(
//                    LogLevel.Information,
//                    It.IsAny<EventId>(),
//                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("registered successfully")),
//                    null,
//                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
//                Times.Once);
//        }
//    }
//}


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

        [Test]
        public async Task AddUser_NullRole_DefaultsToUser()
        {
            var request = new RegisterRequest
            {
                username = "user123",
                password = "pass",
                role = null // should fallback to "User"
            };

            var mappedUser = new User { Username = "user123" };

            _userRepoMock.Setup(x => x.GetUserByUsernameAsync("user123")).ReturnsAsync((User?)null);
            _mapperMock.Setup(x => x.Map<User>(request)).Returns(mappedUser);

            var result = await _controller.AddUser(request);

            Assert.IsInstanceOf<OkObjectResult>(result);
            Assert.AreEqual("User", mappedUser.Role);
        }

        [Test]
        public async Task AddUser_ValidRequest_AddsUserAndReturnsOk()
        {
            // Arrange
            var request = new RegisterRequest
            {
                username = "newuser",
                password = "securepass",
                role = "User"
            };

            var mappedUser = new User { Username = "newuser" };

            _userRepoMock.Setup(x => x.GetUserByUsernameAsync("newuser"))
                         .ReturnsAsync((User?)null);

            _mapperMock.Setup(x => x.Map<User>(request))
                       .Returns(mappedUser);

            _userRepoMock.Setup(x => x.AddUserAsync(It.IsAny<User>()))
                         .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.AddUser(request);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);

            // Check that Role and PasswordHash were set on mappedUser
            Assert.AreEqual("User", mappedUser.Role);
            Assert.AreEqual("securepass", mappedUser.PasswordHash);

            // Verify logging was called
            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("registered successfully")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);

            // Verify AddUserAsync was called with the same user
            _userRepoMock.Verify(repo => repo.AddUserAsync(mappedUser), Times.Once);
        }

        [Test]
        public async Task AddUser_AdminRole_RegistersSuccessfully()
        {
            var request = new RegisterRequest
            {
                username = "adminuser",
                password = "adminpass",
                role = "Admin"
            };

            var mappedUser = new User { Username = "adminuser" };

            _userRepoMock.Setup(x => x.GetUserByUsernameAsync("adminuser"))
                         .ReturnsAsync((User?)null);

            _mapperMock.Setup(x => x.Map<User>(request))
                       .Returns(mappedUser);

            _userRepoMock.Setup(x => x.AddUserAsync(It.IsAny<User>()))
                         .Returns(Task.CompletedTask);

            var result = await _controller.AddUser(request);

            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.AreEqual("Admin", mappedUser.Role);

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("registered successfully")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

    }
}
