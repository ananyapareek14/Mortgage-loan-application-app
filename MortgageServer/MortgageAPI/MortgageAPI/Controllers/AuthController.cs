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

        public AuthController(IAuthService authService, IUserRepository userRepository, IMapper mapper)
        {
            _authService = authService;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authService.AuthenticateAsync(request.Username, request.Password);
            if (token == null)
            {
                return Unauthorized("Invalid username or password");
            }
            return Ok(new { Token = token });
        }

        //[HttpPost("add-user")]
        //[Authorize(Roles = "Admin")]  // Only Admin can access this endpoint
        //public async Task<IActionResult> AddUser([FromBody] RegisterRequest request)
        //{
        //    var existingUser = await _userRepository.GetUserByUsernameAsync(request.Username);
        //    if (existingUser != null)
        //    {
        //        return BadRequest("Username already taken.");
        //    }

        //    // Assign default role as "User" if not provided
        //    string role = string.IsNullOrEmpty(request.Role) ? "User" : request.Role;

        //    // Validate role (must be "Admin" or "User")
        //    if (role != "Admin" && role != "User")
        //    {
        //        return BadRequest("Invalid role. Allowed roles are 'Admin' or 'User'.");
        //    }

        //    var newUser = new User
        //    {
        //        userId = Guid.NewGuid(),
        //        Username = request.Username,
        //        PasswordHash = request.Password,  // Will be hashed in repository
        //        Role = role
        //    };

        //    await _userRepository.AddUserAsync(newUser);
        //    return Ok("User added successfully.");
        //}

        [HttpPost("add-user")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddUser([FromBody] RegisterRequest request)
        {
            var existingUser = await _userRepository.GetUserByUsernameAsync(request.Username);
            if (existingUser != null)
            {
                return BadRequest("Username already taken.");
            }

            // Validate role (must be "Admin" or "User")
            string role = string.IsNullOrEmpty(request.Role) ? "User" : request.Role;
            if (role != "Admin" && role != "User")
            {
                return BadRequest("Invalid role. Allowed roles are 'Admin' or 'User'.");
            }

            // Use AutoMapper to map RegisterRequest to User
            var newUser = _mapper.Map<User>(request);
            newUser.Role = role;
            newUser.PasswordHash = request.Password; // Will be hashed in repository

            await _userRepository.AddUserAsync(newUser);
            return Ok("User added successfully.");
        }
    }
}
