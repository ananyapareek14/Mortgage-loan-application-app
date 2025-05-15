using Microsoft.AspNetCore.Mvc;
using MortgageAPI.Models.DTO;
using MortgageAPI.Repos.Interfaces;

namespace MortgageAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DTICalculatorController : ControllerBase
    {
            private readonly IDTICalculator _dtiCalculator;

            public DTICalculatorController(IDTICalculator dtiCalculator)
            {
                _dtiCalculator = dtiCalculator;
            }

            [HttpPost("calculate")]
            public ActionResult<DtiCalculationResult> Calculate([FromBody] DtiCalculationRequest request)
            {
                if (request.AnnualIncome <= 0)
                    return BadRequest("Annual income must be greater than zero.");

                var result = _dtiCalculator.CalculateDti(request);
                return Ok(result);
            }
    }
}
