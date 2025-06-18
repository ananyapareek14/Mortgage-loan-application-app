//using Microsoft.EntityFrameworkCore;
//using MortgageAPI.Data;
//using MortgageAPI.Models.Domain;
//using MortgageAPI.Repos.Interfaces;

//namespace MortgageAPI.Repos
//{
//    public class InterestRateRepository : IInterestRateRepository
//    {
//        private readonly AppDbContext _context;

//        public InterestRateRepository(AppDbContext context)
//        {
//            _context = context;
//        }

//        public async Task<IEnumerable<InterestRate>> GetAllInterestRatesAsync()
//        {
//            return await _context.InterestRates.OrderBy(l => l.Rate).ToListAsync();
//        }
//    }
//}
