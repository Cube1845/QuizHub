using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FurtherEntityFixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Scored",
                table: "SelectedAnswers");

            migrationBuilder.AddColumn<int>(
                name: "ScoredPoints",
                table: "SelectedAnswers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ScoredPoints",
                table: "SelectedAnswers");

            migrationBuilder.AddColumn<bool>(
                name: "Scored",
                table: "SelectedAnswers",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
