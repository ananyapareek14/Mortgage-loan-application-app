using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoMapper;
using MortgageAPI.Controllers;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;
using NUnit.Framework.Internal.Commands;
using System.Linq.Expressions;
using Microsoft.VisualStudio.TestPlatform.ObjectModel;
using NUnit.Framework;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System;
using System.Diagnostics;
using Azure.Core;

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
            var request = new LoginRequest { username = "testuser", password = "password123" };
            _mockAuthService.Setup(x => x.AuthenticateAsync(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync("valid_token");

            // Act
            var result = await _controller.Login(request);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            dynamic value = okResult.Value;
            Assert.AreEqual("Signed in successfully", value.message);
            Assert.AreEqual("valid_token", value.token);
            Assert.AreEqual("testuser", value.username);
        }

        [Test]
        public async Task Login_InvalidCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var request = new LoginRequest { username = "invaliduser", password = "wrongpassword" };
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
                // Set up user properties as needed for a valid request
                username = "newuser",
                password = "newpassword",
                role = "User"
            };

            // Act
            var result = await _controller.AddUser(user) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.That(result.StatusCode, Is.EqualTo(200));

            var responseValue = result.Value as dynamic;
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
        public void AddUser_NullRole_SetsDefaultRoleToUser()
        {
            // Arrange
            var mockMapper = new Mock<IMapper>();
            var mockUserRepository = new Mock<IUserRepository>();

            var request = new RegisterRequest
            {
                username = "testuser",
                password = "password123",
                role = null // Explicitly set role to null for this test
            };

            var expectedUser = new User
            {
                Username = request.username,
                Role = "User" // Expected default role
            };

            mockMapper.Setup(x => x.Map<User>(It.Is<RegisterRequest>(r => r.role == null)))
                      .Returns(expectedUser)
                      .Verifiable();

            mockUserRepository.Setup(x => x.AddUserAsync(It.IsAny<User>()))
                              .Returns(Task.CompletedTask);

            // Act
            var result = _controller.AddUser(request).Result;

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            mockMapper.Verify(x => x.Map<User>(It.Is<RegisterRequest>(r => r.role == null)), Times.Once);
            mockUserRepository.Verify(x => x.AddUserAsync(It.Is<User>(u => u.Role == "User")), Times.Once);
        }

        [Test]
        public async Task Login_EmptyUsername_ReturnsUnauthorized()
        {
            // Arrange
            var request = new LoginRequest { username = "", password = "password123" };
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
            var request = new LoginRequest { username = "testuser", password = null };
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



// Some of the tests failed. The error message is:  
//Message:
//System.NullReferenceException : Object reference not set to an instance of an object.

//  Stack Trace: 
//AuthController.AddUser(RegisterRequest request) line 69
//AuthControllerTests.AddUser_EmptyPassword_ReturnsBadRequest() line 235
//GenericAdapter`1.GetResult()
//AsyncToSyncAdapter.Await(Func`1 invoke)
//TestMethodCommand.RunTestMethod(TestExecutionContext context)
//TestMethodCommand.Execute(TestExecutionContext context)
//<>c__DisplayClass1_0.<Execute>b__0()
//DelegatingTestCommand.RunTestMethodInThreadAbortSafeZone(TestExecutionContext context, Action action)

// The test code is: 
//[Test]
//public async Task AddUser_EmptyPassword_ReturnsBadRequest()
//{
//    // Arrange
//    var registerRequest = new RegisterRequest
//    {
//        username = "testuser",
//        password = string.Empty,
//        role = "User"
//    };

//    // Act
//    var result = await _controller.AddUser(registerRequest);

//    // Assert
//    Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
//    var badRequestResult = result as BadRequestObjectResult;
//    Assert.That(badRequestResult, Is.Not.Null);
//    Assert.That(badRequestResult.Value, Is.EqualTo("Invalid username or password"));
//}

// Also the user should be either User or Admin