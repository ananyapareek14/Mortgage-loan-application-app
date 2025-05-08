using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MortgageAPI.Data;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPI.Repos
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserRepository(AppDbContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<User?> AuthenticateUserAsync(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null) return null;

            var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            return verificationResult == PasswordVerificationResult.Success ? user : null;
        }

        public async Task<User?> GetUserByUsernameAsync(string userName)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == userName);
        }

        //public async Task AddUserAsync(User user)
        //{
        //    user.PasswordHash = _passwordHasher.HashPassword(user, user.PasswordHash);
        //    await _context.Users.AddAsync(user);
        //    await _context.SaveChangesAsync();
        //}
        public async Task AddUserAsync(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            if (await _context.Users.AnyAsync(u => u.Username == user.Username))
                throw new DbUpdateException("Username already exists");

            user.PasswordHash = _passwordHasher.HashPassword(user, user.PasswordHash);
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }
    }
}
