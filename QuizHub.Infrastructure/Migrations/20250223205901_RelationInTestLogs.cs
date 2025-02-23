using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RelationInTestLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_TestLogs_TestId",
                table: "TestLogs",
                column: "TestId");

            migrationBuilder.AddForeignKey(
                name: "FK_TestLogs_Tests_TestId",
                table: "TestLogs",
                column: "TestId",
                principalTable: "Tests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TestLogs_Tests_TestId",
                table: "TestLogs");

            migrationBuilder.DropIndex(
                name: "IX_TestLogs_TestId",
                table: "TestLogs");
        }
    }
}
