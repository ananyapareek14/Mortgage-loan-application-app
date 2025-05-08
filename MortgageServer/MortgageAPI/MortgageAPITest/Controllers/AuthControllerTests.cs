using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoMapper;
using MortgageAPI.Controllers;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPITest.Controllers
{

    [TestFixture]
    public class AuthControllerTests
    {
        private Mock<IAuthService> _mockAuthService;
        private Mock<IUserRepository> _mockUserRepository;
        private Mock<IMapper> _mockMapper;
        private Mock<ILogger<AuthController>> _mockLogger;
        private AuthController _controller;

        [SetUp]
        public void Setup()
        {
            _mockAuthService = new Mock<IAuthService>();
            _mockUserRepository = new Mock<IUserRepository>();
            _mockMapper = new Mock<IMapper>();
            _mockLogger = new Mock<ILogger<AuthController>>();
            _controller = new AuthController(_mockAuthService.Object, _mockUserRepository.Object, _mockMapper.Object, _mockLogger.Object);
        }

        [Test]
        public async Task Login_ValidCredentials_ReturnsOkResult()
        {
            // Arrange
            var request = new LoginDTO { username = "testuser", password = "password123" };
            _mockAuthService.Setup(x => x.AuthenticateAsync(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync("valid_token");

            // Act
            var result = await _controller.Login(request);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var value = okResult.Value as LoginResponse;
            Assert.IsNotNull(value);
            Assert.AreEqual("Signed in successfully", value.message);
            Assert.AreEqual("valid_token", value.token);
            Assert.AreEqual("testuser", value.username);

        }

        [Test]
        public async Task Login_InvalidCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var request = new LoginDTO { username = "invaliduser", password = "wrongpassword" };
            _mockAuthService.Setup(x => x.AuthenticateAsync(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync((string)null);

            // Act
            var result = await _controller.Login(request);

            // Assert
            Assert.IsInstanceOf<UnauthorizedObjectResult>(result);
            var unauthorizedResult = result as UnauthorizedObjectResult;
            Assert.IsNotNull(unauthorizedResult);
            Assert.AreEqual("Invalid username or password", unauthorizedResult.Value);
        }

        [Test]
        public async Task AddUser_ValidRequest_ReturnsOkResult()
        {
            // Arrange
            var user = new RegisterRequest
            {
                username = "newuser",
                password = "newpassword",
                role = "User"
            };

            var mappedUser = new User
            {
                Username = user.username,
                PasswordHash = "hashedpassword",
                Role = user.role
            };

            _mockUserRepository.Setup(x => x.GetUserByUsernameAsync(user.username)).ReturnsAsync((User)null);
            _mockMapper.Setup(x => x.Map<User>(user)).Returns(mappedUser);
            _mockUserRepository.Setup(x => x.AddUserAsync(It.IsAny<User>())).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.AddUser(user) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.That(result.StatusCode, Is.EqualTo(200));

            var responseValue = result.Value as RegisterResponse;
            Assert.IsNotNull(responseValue);
            Assert.That(responseValue.message, Is.EqualTo("User added successfully."));

        }


        [Test]
        public async Task AddUser_ExistingUsername_ReturnsBadRequest()
        {
            // Arrange
            var request = new RegisterRequest { username = "existinguser", password = "password" };
            _mockUserRepository.Setup(x => x.GetUserByUsernameAsync(It.IsAny<string>()))
                .ReturnsAsync(new User());

            // Act
            var result = await _controller.AddUser(request);

            // Assert
            Assert.IsInstanceOf<BadRequestObjectResult>(result);
            var badRequestResult = result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult);
            Assert.AreEqual("Username already taken.", badRequestResult.Value);
        }

        [Test]
        public async Task AddUser_InvalidRole_ReturnsBadRequest()
        {
            // Arrange
            var request = new RegisterRequest { username = "newuser", password = "password", role = "InvalidRole" };
            _mockUserRepository.Setup(x => x.GetUserByUsernameAsync(It.IsAny<string>()))
                .ReturnsAsync((User)null);

            // Act
            var result = await _controller.AddUser(request);

            // Assert
            Assert.IsInstanceOf<BadRequestObjectResult>(result);
            var badRequestResult = result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult);
            Assert.AreEqual("Invalid role. Allowed roles are 'Admin' or 'User'.", badRequestResult.Value);
        }

        [Test]
        public async Task AddUser_NullRole_SetsDefaultRoleToUser()
        {
            // Arrange
            var request = new RegisterRequest
            {
                username = "testuser",
                password = "password123",
                role = string.Empty
            };

            var mappedUser = new User
            {
                Username = request.username,
                PasswordHash = "hashedpassword",
                Role = "User"
            };

            _mockUserRepository.Setup(x => x.GetUserByUsernameAsync(request.username))
                .ReturnsAsync((User)null);

            _mockMapper.Setup(x => x.Map<User>(request))
                .Returns(mappedUser);

            _mockUserRepository.Setup(x => x.AddUserAsync(It.Is<User>(u => u.Role == "User")))
                .Returns(Task.CompletedTask)
                .Verifiable();

            // Act
            var result = await _controller.AddUser(request);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);

            var responseValue = okResult.Value as RegisterResponse;
            Assert.IsNotNull(responseValue);
            Assert.AreEqual("User added successfully.", responseValue.message);

            _mockUserRepository.Verify(x => x.AddUserAsync(It.Is<User>(u => u.Role == "User")), Times.Once);
            _mockMapper.Verify(x => x.Map<User>(It.Is<RegisterRequest>(r => r.role == string.Empty)), Times.Once);
        }


        [Test]
        public async Task Login_EmptyUsername_ReturnsUnauthorized()
        {
            // Arrange
            var request = new LoginDTO { username = "", password = "password123" };
            _mockAuthService.Setup(x => x.AuthenticateAsync(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync((string)null);

            // Act
            var result = await _controller.Login(request);

            // Assert
            Assert.IsInstanceOf<UnauthorizedObjectResult>(result);
        }

        [Test]
        public async Task Login_NullPassword_ReturnsUnauthorized()
        {
            // Arrange
            var request = new LoginDTO { username = "testuser", password = null };
            _mockAuthService.Setup(x => x.AuthenticateAsync(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync((string)null);

            // Act
            var result = await _controller.Login(request);

            // Assert
            Assert.IsInstanceOf<UnauthorizedObjectResult>(result);
        }

        [Test]
        public async Task AddUser_MaxLengthUsername_ReturnsOkResult()
        {
            // Arrange
            var maxLengthUsername = new string('a', 50); // Assuming max length is 50
            var request = new RegisterRequest { username = maxLengthUsername, password = "password", role = "User" };
            _mockUserRepository.Setup(x => x.GetUserByUsernameAsync(It.IsAny<string>()))
                .ReturnsAsync((User)null);
            _mockMapper.Setup(x => x.Map<User>(It.IsAny<RegisterRequest>()))
                .Returns(new User());

            // Act
            var result = await _controller.AddUser(request);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task AddUser_EmptyPassword_ReturnsBadRequest()
        {
            // Arrange
            var registerRequest = new RegisterRequest
            {
                username = "testuser",
                password = string.Empty,
                role = "User"
            };

            // Act
            var result = await _controller.AddUser(registerRequest);

            // Assert
            Assert.That(result, Is.Not.Null, "Result should not be null");
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>(), "Result should be of type BadRequestObjectResult");

            var badRequestResult = result as BadRequestObjectResult;
            Assert.That(badRequestResult, Is.Not.Null, "BadRequestObjectResult should not be null");
            Assert.That(badRequestResult.Value, Is.EqualTo("Invalid username or password"));
        }
    }
}