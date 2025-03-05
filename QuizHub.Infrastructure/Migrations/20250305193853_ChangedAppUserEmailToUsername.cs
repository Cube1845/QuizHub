using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangedAppUserEmailToUsername : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Email",
                table: "AppUsers",
                newName: "Username");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "AppUsers",
                newName: "Email");
        }
    }
}
