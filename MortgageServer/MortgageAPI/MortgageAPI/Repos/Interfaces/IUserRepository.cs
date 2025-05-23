﻿using MortgageAPI.Models.Domain;

namespace MortgageAPI.Repos.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> AuthenticateUserAsync(string username, string password);
        Task<User> GetUserByUsernameAsync(string userName);
        Task AddUserAsync(User user);
    }
}
