using AutoMapper;
using MortgageAPI.Models.Domain;

namespace MortgageAPI.Models.Profile
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<RegisterRequest, User>();

            CreateMap<Loan, LoanDto>();
            CreateMap<LoanRequest, Loan>();

            CreateMap<InterestRate, InterestRateDto>();
            CreateMap<AmortizationSchedule, AmortizationScheduleDto>();
        }
    }
}
