using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MortgageAPI.Data;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos;

namespace MortgageAPITest.Repos
{
    public class UserRepositoryTests
    {
        private AppDbContext _context = null!;
        private UserRepository _repo = null!;
        private IPasswordHasher<User> _passwordHasher = null!;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _passwordHasher = new PasswordHasher<User>();
            _repo = new UserRepository(_context, _passwordHasher);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task AddUserAsync_HashesPasswordAndSaves()
        {
            var user = new User
            {
                Username = "newuser",
                PasswordHash = "plaintext"
            };

            await _repo.AddUserAsync(user);

            var saved = await _context.Users.FirstOrDefaultAsync(u => u.Username == "newuser");

            Assert.NotNull(saved);
            Assert.AreNotEqual("plaintext", saved!.PasswordHash);
        }

        [Test]
        public async Task AuthenticateUserAsync_ValidPassword_ReturnsUser()
        {
            var user = new User
            {
                Username = "validuser",
                PasswordHash = ""
            };
            user.PasswordHash = _passwordHasher.HashPassword(user, "securepass");
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var result = await _repo.AuthenticateUserAsync("validuser", "securepass");

            Assert.IsNotNull(result);
        }

        [Test]
        public async Task AuthenticateUserAsync_InvalidPassword_ReturnsNull()
        {
            var user = new User
            {
                Username = "validuser",
                PasswordHash = ""
            };
            user.PasswordHash = _passwordHasher.HashPassword(user, "securepass");
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var result = await _repo.AuthenticateUserAsync("validuser", "wrongpass");

            Assert.IsNull(result);
        }
    }
}
