using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MortgageAPI.Migrations
{
    /// <inheritdoc />
    public partial class MPmig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "MonthlyPayment",
                table: "AmortizationSchedules",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MonthlyPayment",
                table: "AmortizationSchedules");
        }
    }
}
