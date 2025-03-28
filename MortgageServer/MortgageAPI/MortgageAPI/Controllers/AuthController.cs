﻿using AutoMapper;
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
            var Token = await _authService.AuthenticateAsync(request.username, request.password);
            if (Token == null)
            {
                return Unauthorized("Invalid username or password");
            }
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
            var existingUser = await _userRepository.GetUserByUsernameAsync(request.username);
            if (existingUser != null)
            {
                return BadRequest("Username already taken.");
            }

            // Validate role (must be "Admin" or "User")
            string role = string.IsNullOrEmpty(request.role) ? "User" : request.role;
            if (role != "Admin" && role != "User")
            {
                return BadRequest("Invalid role. Allowed roles are 'Admin' or 'User'.");
            }

            // Use AutoMapper to map RegisterRequest to User
            var newUser = _mapper.Map<User>(request);
            newUser.Role = role;
            newUser.PasswordHash = request.password; // Will be hashed in repository

            await _userRepository.AddUserAsync(newUser);
            return Ok(new
            {
                message = "User added successfully."
            });
        }
    }
}
