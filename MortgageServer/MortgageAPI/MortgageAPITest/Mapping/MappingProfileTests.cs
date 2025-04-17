using AutoMapper;
using MortgageAPI.Models.Domain;
using MortgageAPI.Models.DTO;
using MortgageAPI.Models.Mapping;
using NUnit.Framework;

namespace MortgageAPITest.Mappings
{
    public class MappingProfileTests
    {
        private IMapper _mapper = null!;

        [SetUp]
        public void SetUp()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfile>();
            });

            config.AssertConfigurationIsValid();
            _mapper = config.CreateMapper();
        }

        [Test]
        public void RegisterRequest_To_User_AssignsNewGuid_And_IgnoresPasswordHash()
        {
            // Arrange
            var request = new RegisterRequest
            {
                username = "testuser",
                password = "plaintext"
            };

            // Act
            var user = _mapper.Map<User>(request);

            // Assert
            Assert.AreEqual("testuser", user.Username);
            Assert.AreNotEqual(Guid.Empty, user.userId);          // New GUID generated
            Assert.That(user.PasswordHash, Is.Null.Or.Empty);     // Accept null or empty string
        }


        [Test]
        public void AmortizationSchedule_To_Dto_MapsAndRoundsValuesCorrectly()
        {
            // Arrange
            var schedule = new AmortizationSchedule
            {
                MonthlyPayment = 123.4567m,
                PrincipalPayment = 78.91011m,
                InterestPayment = 12.3456m,
                RemainingBalance = 999.9999m
            };

            // Act
            var dto = _mapper.Map<AmortizationScheduleDto>(schedule);

            // Assert
            Assert.AreEqual(123.46m, dto.MonthlyPayment);
            Assert.AreEqual(78.91m, dto.PrincipalPayment);
            Assert.AreEqual(12.35m, dto.InterestPayment);
            Assert.AreEqual(1000.00m, dto.RemainingBalance);
        }
    }
}
