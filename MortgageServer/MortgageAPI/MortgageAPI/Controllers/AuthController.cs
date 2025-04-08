using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPI.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, IUserRepository userRepository, IMapper mapper, ILogger<AuthController> logger)
        {
            _authService = authService;
            _userRepository = userRepository;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            _logger.LogInformation("Login attempt for user: {Username}", request.username); 
            var Token = await _authService.AuthenticateAsync(request.username, request.password);
            if (Token == null)
            {
                _logger.LogWarning("Failed login for user: {Username}", request.username);
                return Unauthorized("Invalid username or password");
            }
            _logger.LogInformation("User {Username} logged in successfully.", request.username);
            return Ok(new
            {
                message = "Signed in successfully",
                token = Token,
                username = request.username
            });
        }


        [HttpPost("register")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddUser([FromBody] RegisterRequest request)
        {
            _logger.LogInformation("User registration attempt by admin for: {Username}", request.username);
            var existingUser = await _userRepository.GetUserByUsernameAsync(request.username);
            if (existingUser != null)
            {
                _logger.LogWarning("Registration failed - username taken: {Username}", request.username);
                return BadRequest("Username already taken.");
            }

            // Validate role (must be "Admin" or "User")
            string role = string.IsNullOrEmpty(request.role) ? "User" : request.role;
            if (role != "Admin" && role != "User")
            {
                _logger.LogWarning("Invalid role during registration: {Role}", request.role);
                return BadRequest("Invalid role. Allowed roles are 'Admin' or 'User'.");
            }

            // Use AutoMapper to map RegisterRequest to User
            var newUser = _mapper.Map<User>(request);
            newUser.Role = role;
            newUser.PasswordHash = request.password; // Will be hashed in repository

            await _userRepository.AddUserAsync(newUser);
            _logger.LogInformation("User {Username} registered successfully with role {Role}.", request.username, role);
            return Ok(new
            {
                message = "User added successfully."
            });
        }
    }
}
