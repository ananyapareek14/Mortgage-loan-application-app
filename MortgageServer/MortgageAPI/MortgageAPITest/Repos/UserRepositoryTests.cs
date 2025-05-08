//using Moq;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.EntityFrameworkCore;
//using MortgageAPI.Data;
//using MortgageAPI.Models.Domain;
//using MortgageAPI.Repos;

//namespace MortgageAPITest.Repos;

//[TestFixture]
//public class UserRepositoryTests
//{
//    private Mock<AppDbContext> _mockContext;
//    private Mock<IPasswordHasher<User>> _mockPasswordHasher;
//    private UserRepository _userRepository;
//    private Mock<DbSet<User>> _mockUserDbSet;

//    [SetUp]
//    public void Setup()
//    {
//        _mockContext = new Mock<AppDbContext>();
//        _mockPasswordHasher = new Mock<IPasswordHasher<User>>();
//        _mockUserDbSet = new Mock<DbSet<User>>();
//        _mockContext.Setup(c => c.Users).Returns(_mockUserDbSet.Object);
//        _userRepository = new UserRepository(_mockContext.Object, _mockPasswordHasher.Object);
//    }

//    [Test]
//    public async Task AuthenticateUserAsync_ValidCredentials_ReturnsUser()
//    {
//        // Arrange
//        var user = new User { Username = "testuser", PasswordHash = "hashedpassword" };
//        _mockUserDbSet.Setup(d => d.FirstOrDefaultAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>(), default))
//            .ReturnsAsync(user);
//        _mockPasswordHasher.Setup(p => p.VerifyHashedPassword(user, user.PasswordHash, "password"))
//            .Returns(PasswordVerificationResult.Success);

//        // Act
//        var result = await _userRepository.AuthenticateUserAsync("testuser", "password");

//        // Assert
//        Assert.That(result, Is.EqualTo(user));
//    }

//    [Test]
//    public async Task AuthenticateUserAsync_InvalidUsername_ReturnsNull()
//    {
//        // Arrange
//        _mockUserDbSet.Setup(d => d.FirstOrDefaultAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>(), default))
//            .ReturnsAsync((User)null);

//        // Act
//        var result = await _userRepository.AuthenticateUserAsync("nonexistentuser", "password");

//        // Assert
//        Assert.That(result, Is.Null);
//    }

//    [Test]
//    public async Task AuthenticateUserAsync_InvalidPassword_ReturnsNull()
//    {
//        // Arrange
//        var user = new User { Username = "testuser", PasswordHash = "hashedpassword" };
//        _mockUserDbSet.Setup(d => d.FirstOrDefaultAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>(), default))
//            .ReturnsAsync(user);
//        _mockPasswordHasher.Setup(p => p.VerifyHashedPassword(user, user.PasswordHash, "wrongpassword"))
//            .Returns(PasswordVerificationResult.Failed);

//        // Act
//        var result = await _userRepository.AuthenticateUserAsync("testuser", "wrongpassword");

//        // Assert
//        Assert.That(result, Is.Null);
//    }

//    [Test]
//    public async Task GetUserByUsernameAsync_ExistingUser_ReturnsUser()
//    {
//        // Arrange
//        var user = new User { Username = "testuser" };
//        _mockUserDbSet.Setup(d => d.FirstOrDefaultAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>(), default))
//            .ReturnsAsync(user);

//        // Act
//        var result = await _userRepository.GetUserByUsernameAsync("testuser");

//        // Assert
//        Assert.That(result, Is.EqualTo(user));
//    }

//    [Test]
//    public async Task GetUserByUsernameAsync_NonexistentUser_ReturnsNull()
//    {
//        // Arrange
//        _mockUserDbSet.Setup(d => d.FirstOrDefaultAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>(), default))
//            .ReturnsAsync((User)null);

//        // Act
//        var result = await _userRepository.GetUserByUsernameAsync("nonexistentuser");

//        // Assert
//        Assert.That(result, Is.Null);
//    }

//    [Test]
//    public async Task AddUserAsync_ValidUser_AddsAndSavesUser()
//    {
//        // Arrange
//        var user = new User { Username = "newuser", PasswordHash = "password" };
//        _mockPasswordHasher.Setup(p => p.HashPassword(user, user.PasswordHash))
//            .Returns("hashedpassword");

//        // Act
//        await _userRepository.AddUserAsync(user);

//        // Assert
//        _mockUserDbSet.Verify(d => d.AddAsync(user, default), Times.Once);
//        _mockContext.Verify(c => c.SaveChangesAsync(default), Times.Once);
//        Assert.That(user.PasswordHash, Is.EqualTo("hashedpassword"));
//    }

//    [Test]
//    public void AddUserAsync_NullUser_ThrowsArgumentNullException()
//    {
//        // Act & Assert
//        Assert.ThrowsAsync<ArgumentNullException>(() => _userRepository.AddUserAsync(null));
//    }

//    [Test]
//    public async Task AddUserAsync_DuplicateUsername_ThrowsDbUpdateException()
//    {
//        // Arrange
//        var user = new User { Username = "existinguser", PasswordHash = "password" };
//        _mockPasswordHasher.Setup(p => p.HashPassword(user, user.PasswordHash))
//            .Returns("hashedpassword");
//        _mockContext.Setup(c => c.SaveChangesAsync(default))
//            .ThrowsAsync(new DbUpdateException());

//        // Act & Assert
//        Assert.ThrowsAsync<DbUpdateException>(() => _userRepository.AddUserAsync(user));
//    }
//}


using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MortgageAPI.Data;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos;

namespace MortgageAPITest.Repos;

[TestFixture]
public class UserRepositoryTests
{
    private AppDbContext _dbContext;
    private IPasswordHasher<User> _passwordHasher;
    private UserRepository _userRepository;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // ensures isolation between tests
            .Options;

        _dbContext = new AppDbContext(options);
        _passwordHasher = new PasswordHasher<User>();
        _userRepository = new UserRepository(_dbContext, _passwordHasher);
    }

    [TearDown]
    public void TearDown()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }

    [Test]
    public async Task AuthenticateUserAsync_ValidCredentials_ReturnsUser()
    {
        // Arrange
        var user = new User { Username = "testuser" };
        user.PasswordHash = _passwordHasher.HashPassword(user, "password");
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _userRepository.AuthenticateUserAsync("testuser", "password");

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Username, Is.EqualTo("testuser"));
    }

    [Test]
    public async Task AuthenticateUserAsync_InvalidUsername_ReturnsNull()
    {
        // Act
        var result = await _userRepository.AuthenticateUserAsync("nonexistentuser", "password");

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task AuthenticateUserAsync_InvalidPassword_ReturnsNull()
    {
        // Arrange
        var user = new User { Username = "testuser" };
        user.PasswordHash = _passwordHasher.HashPassword(user, "correctpassword");
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();

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
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _userRepository.GetUserByUsernameAsync("testuser");

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Username, Is.EqualTo("testuser"));
    }

    [Test]
    public async Task GetUserByUsernameAsync_NonexistentUser_ReturnsNull()
    {
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

        // Act
        await _userRepository.AddUserAsync(user);

        // Assert
        var addedUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == "newuser");
        Assert.That(addedUser, Is.Not.Null);
        Assert.That(addedUser.PasswordHash, Is.Not.EqualTo("password")); // Ensure it's hashed
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
        var user1 = new User { Username = "existinguser", PasswordHash = "pass1" };
        var user2 = new User { Username = "existinguser", PasswordHash = "pass2" };
        await _userRepository.AddUserAsync(user1);

        // Act & Assert
        Assert.ThrowsAsync<DbUpdateException>(() => _userRepository.AddUserAsync(user2));
    }
}
