using Moq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MortgageAPI.Data;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos;

namespace MortgageAPITest.Repos;

[TestFixture]
public class UserRepositoryTests
{
    private Mock<AppDbContext> _mockContext;
    private Mock<IPasswordHasher<User>> _mockPasswordHasher;
    private UserRepository _userRepository;
    private Mock<DbSet<User>> _mockUserDbSet;

    [SetUp]
    public void Setup()
    {
        _mockContext = new Mock<AppDbContext>();
        _mockPasswordHasher = new Mock<IPasswordHasher<User>>();
        _mockUserDbSet = new Mock<DbSet<User>>();
        _mockContext.Setup(c => c.Users).Returns(_mockUserDbSet.Object);
        _userRepository = new UserRepository(_mockContext.Object, _mockPasswordHasher.Object);
    }

    [Test]
    public async Task AuthenticateUserAsync_ValidCredentials_ReturnsUser()
    {
        // Arrange
        var user = new User { Username = "testuser", PasswordHash = "hashedpassword" };
        _mockUserDbSet.Setup(d => d.FirstOrDefaultAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>(), default))
            .ReturnsAsync(user);
        _mockPasswordHasher.Setup(p => p.VerifyHashedPassword(user, user.PasswordHash, "password"))
            .Returns(PasswordVerificationResult.Success);

        // Act
        var result = await _userRepository.AuthenticateUserAsync("testuser", "password");

        // Assert
        Assert.That(result, Is.EqualTo(user));
    }

    [Test]
    public async Task AuthenticateUserAsync_InvalidUsername_ReturnsNull()
    {
        // Arrange
        _mockUserDbSet.Setup(d => d.FirstOrDefaultAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>(), default))
            .ReturnsAsync((User)null);

        // Act
        var result = await _userRepository.AuthenticateUserAsync("nonexistentuser", "password");

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task AuthenticateUserAsync_InvalidPassword_ReturnsNull()
    {
        // Arrange
        var user = new User { Username = "testuser", PasswordHash = "hashedpassword" };
        _mockUserDbSet.Setup(d => d.FirstOrDefaultAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>(), default))
            .ReturnsAsync(user);
        _mockPasswordHasher.Setup(p => p.VerifyHashedPassword(user, user.PasswordHash, "wrongpassword"))
            .Returns(PasswordVerificationResult.Failed);

        // Act
        var result = await _userRepository.AuthenticateUserAsync("testuser", "wrongpassword");

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetUserByUsernameAsync_ExistingUser_ReturnsUser()
    {
        // Arrange
        var user = new User { Username = "testuser" };
        _mockUserDbSet.Setup(d => d.FirstOrDefaultAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>(), default))
            .ReturnsAsync(user);

        // Act
        var result = await _userRepository.GetUserByUsernameAsync("testuser");

        // Assert
        Assert.That(result, Is.EqualTo(user));
    }

    [Test]
    public async Task GetUserByUsernameAsync_NonexistentUser_ReturnsNull()
    {
        // Arrange
        _mockUserDbSet.Setup(d => d.FirstOrDefaultAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>(), default))
            .ReturnsAsync((User)null);

        // Act
        var result = await _userRepository.GetUserByUsernameAsync("nonexistentuser");

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task AddUserAsync_ValidUser_AddsAndSavesUser()
    {
        // Arrange
        var user = new User { Username = "newuser", PasswordHash = "password" };
        _mockPasswordHasher.Setup(p => p.HashPassword(user, user.PasswordHash))
            .Returns("hashedpassword");

        // Act
        await _userRepository.AddUserAsync(user);

        // Assert
        _mockUserDbSet.Verify(d => d.AddAsync(user, default), Times.Once);
        _mockContext.Verify(c => c.SaveChangesAsync(default), Times.Once);
        Assert.That(user.PasswordHash, Is.EqualTo("hashedpassword"));
    }

    [Test]
    public void AddUserAsync_NullUser_ThrowsArgumentNullException()
    {
        // Act & Assert
        Assert.ThrowsAsync<ArgumentNullException>(() => _userRepository.AddUserAsync(null));
    }

    [Test]
    public async Task AddUserAsync_DuplicateUsername_ThrowsDbUpdateException()
    {
        // Arrange
        var user = new User { Username = "existinguser", PasswordHash = "password" };
        _mockPasswordHasher.Setup(p => p.HashPassword(user, user.PasswordHash))
            .Returns("hashedpassword");
        _mockContext.Setup(c => c.SaveChangesAsync(default))
            .ThrowsAsync(new DbUpdateException());

        // Act & Assert
        Assert.ThrowsAsync<DbUpdateException>(() => _userRepository.AddUserAsync(user));
    }
}