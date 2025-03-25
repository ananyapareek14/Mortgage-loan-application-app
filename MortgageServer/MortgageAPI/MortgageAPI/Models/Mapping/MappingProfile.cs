using AutoMapper;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;

namespace MortgageAPI.Models.Profile
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<RegisterRequest, User>()
            .ForMember(dest => dest.userId, opt => opt.MapFrom(_ => Guid.NewGuid())) // Generate new GUID
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()); // Will be hashed separately

            CreateMap<Loan, LoanDto>();
            CreateMap<LoanRequest, Loan>();

            CreateMap<InterestRate, InterestRateDto>();
            CreateMap<AmortizationSchedule, AmortizationScheduleDto>();
        }
    }
}
