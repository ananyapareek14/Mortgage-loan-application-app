using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MortgageAPI.Migrations
{
    /// <inheritdoc />
    public partial class LookUpProductsMig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InterestRates");

            migrationBuilder.AddColumn<Guid>(
                name: "LoanProductId",
                table: "Loans",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "LoanProducts",
                columns: table => new
                {
                    LoanProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    TermYears = table.Column<int>(type: "int", nullable: false),
                    FixedRatePeriodYears = table.Column<int>(type: "int", nullable: true),
                    AdjustmentFrequencyMonths = table.Column<int>(type: "int", nullable: true),
                    InitialRateMargin = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    IndexName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoanProducts", x => x.LoanProductId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Loans_LoanProductId",
                table: "Loans",
                column: "LoanProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_Loans_LoanProducts_LoanProductId",
                table: "Loans",
                column: "LoanProductId",
                principalTable: "LoanProducts",
                principalColumn: "LoanProductId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Loans_LoanProducts_LoanProductId",
                table: "Loans");

            migrationBuilder.DropTable(
                name: "LoanProducts");

            migrationBuilder.DropIndex(
                name: "IX_Loans_LoanProductId",
                table: "Loans");

            migrationBuilder.DropColumn(
                name: "LoanProductId",
                table: "Loans");

            migrationBuilder.CreateTable(
                name: "InterestRates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Rate = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    ValidFrom = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InterestRates", x => x.Id);
                });
        }
    }
}
