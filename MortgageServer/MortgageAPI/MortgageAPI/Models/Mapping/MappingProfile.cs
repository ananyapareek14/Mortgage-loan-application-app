using AutoMapper;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;

namespace MortgageAPI.Models.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<RegisterRequest, User>()
            .ForMember(dest => dest.userId, opt => opt.MapFrom(_ => Guid.NewGuid())) // Generate new GUID
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()); // Will be hashed separately

            CreateMap<Loan, LoanDto>();
            CreateMap<LoanRequest, Loan>();

            CreateMap<InterestRate, InterestRateDto>();
            //CreateMap<AmortizationSchedule, AmortizationScheduleDto>();
            CreateMap<AmortizationSchedule, AmortizationScheduleDto>()
            .ForMember(dest => dest.MonthlyPayment, opt => opt.MapFrom(src => Math.Round(src.MonthlyPayment, 2)))
            .ForMember(dest => dest.PrincipalPayment, opt => opt.MapFrom(src => Math.Round(src.PrincipalPayment, 2)))
            .ForMember(dest => dest.InterestPayment, opt => opt.MapFrom(src => Math.Round(src.InterestPayment, 2)))
            .ForMember(dest => dest.RemainingBalance, opt => opt.MapFrom(src => Math.Round(src.RemainingBalance, 2)));
        }
    }
}
