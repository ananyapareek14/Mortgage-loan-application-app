using Microsoft.AspNetCore.Identity;
using MortgageAPI.Models.Domain;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPI.Repos
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        private readonly IPasswordHasher<User> _passwordHasher;

        public AuthService(IUserRepository userRepository, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }

        public async Task<string?> AuthenticateAsync(string username, string password)
        {
            var user = await _userRepository.AuthenticateUserAsync(username, password);
            if (user == null) return null; // Invalid credentials

            return _tokenService.GenerateToken(user);
        }
    }
}
