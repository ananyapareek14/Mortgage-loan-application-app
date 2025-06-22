//using AutoMapper;
//using MortgageAPI.Models.Domain;
//using MortgageAPI.Models.DTO;

//namespace MortgageAPI.Models.Mapping
//{
//    public class MappingProfile : Profile
//    {
//        public MappingProfile()
//        {
//            CreateMap<RegisterRequest, User>()
//                .ForMember(dest => dest.userId, opt => opt.MapFrom(_ => Guid.NewGuid())) // Generate new GUID
//                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())               // Will be hashed separately
//                .ForMember(dest => dest.Loans, opt => opt.Ignore());                     // Explicitly ignored

//            CreateMap<LoanRequest, Loan>()
//                .ForMember(dest => dest.LoanId, opt => opt.Ignore())
//                .ForMember(dest => dest.UserId, opt => opt.Ignore())
//                .ForMember(dest => dest.UserLoanNumber, opt => opt.Ignore())
//                .ForMember(dest => dest.ApplicationDate, opt => opt.Ignore())
//                .ForMember(dest => dest.ApprovalStatus, opt => opt.Ignore())
//                .ForMember(dest => dest.User, opt => opt.Ignore())
//                .ForMember(dest => dest.AmortizationSchedules, opt => opt.Ignore());

//            CreateMap<Loan, LoanDto>()
//                .ForMember(dest => dest.UserLoanNumber, opt => opt.MapFrom(src => src.UserLoanNumber));

//            //CreateMap<InterestRate, InterestRateDto>();

//            CreateMap<AmortizationSchedule, AmortizationScheduleDto>()
//                .ForMember(dest => dest.MonthlyPayment, opt => opt.MapFrom(src => Math.Round(src.MonthlyPayment, 2)))
//                .ForMember(dest => dest.PrincipalPayment, opt => opt.MapFrom(src => Math.Round(src.PrincipalPayment, 2)))
//                .ForMember(dest => dest.InterestPayment, opt => opt.MapFrom(src => Math.Round(src.InterestPayment, 2)))
//                .ForMember(dest => dest.RemainingBalance, opt => opt.MapFrom(src => Math.Round(src.RemainingBalance, 2)));
//        }

//    }
//}

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
                .ForMember(dest => dest.userId, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.Loans, opt => opt.Ignore());

            CreateMap<LoanRequest, Loan>()
    .ForMember(dest => dest.LoanId, opt => opt.Ignore())
    .ForMember(dest => dest.UserId, opt => opt.Ignore())
    .ForMember(dest => dest.UserLoanNumber, opt => opt.Ignore())
    .ForMember(dest => dest.ApplicationDate, opt => opt.MapFrom(src => src.ApplicationDate))
    .ForMember(dest => dest.InterestRate, opt => opt.Ignore())  // Set conditionally
    .ForMember(dest => dest.LoanProduct, opt => opt.Ignore())   // Set manually
    .ForMember(dest => dest.LoanProductId, opt => opt.Ignore()) // Set manually
    .ForMember(dest => dest.ApprovalStatus, opt => opt.Ignore())
    .ForMember(dest => dest.User, opt => opt.Ignore())
    .ForMember(dest => dest.AmortizationSchedules, opt => opt.Ignore());

            CreateMap<Loan, LoanDto>()
    .ForMember(dest => dest.UserLoanNumber, opt => opt.MapFrom(src => src.UserLoanNumber))
    //.ForMember(dest => dest.ProductCode, opt => opt.MapFrom(src => src.LoanProduct.ProductCode))
    .ForMember(dest => dest.LoanType, opt => opt.MapFrom(src => src.LoanProduct.Type.ToString()));


            CreateMap<AmortizationSchedule, AmortizationScheduleDto>()
                .ForMember(dest => dest.MonthlyPayment, opt => opt.MapFrom(src => Math.Round(src.MonthlyPayment, 2)))
                .ForMember(dest => dest.PrincipalPayment, opt => opt.MapFrom(src => Math.Round(src.PrincipalPayment, 2)))
                .ForMember(dest => dest.InterestPayment, opt => opt.MapFrom(src => Math.Round(src.InterestPayment, 2)))
                .ForMember(dest => dest.RemainingBalance, opt => opt.MapFrom(src => Math.Round(src.RemainingBalance, 2)));
        }
    }
}
