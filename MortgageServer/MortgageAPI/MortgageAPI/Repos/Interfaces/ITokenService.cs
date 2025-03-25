using MortgageAPI.Models.Domain;

namespace MortgageAPI.Repos.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
