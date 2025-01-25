using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedTests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TestsOptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuestionCount = table.Column<int>(type: "int", nullable: false),
                    TestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestsOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TestsOptions_Tests_TestId",
                        column: x => x.TestId,
                        principalTable: "Tests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionBasesWithQuestionCount",
                columns: table => new
                {
                    TestOptionsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuestionBaseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MinimalQuestionCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionBasesWithQuestionCount", x => new { x.TestOptionsId, x.QuestionBaseId });
                    table.ForeignKey(
                        name: "FK_QuestionBasesWithQuestionCount_TestsOptions_TestOptionsId",
                        column: x => x.TestOptionsId,
                        principalTable: "TestsOptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionBases_Id_OwnerId",
                table: "QuestionBases",
                columns: new[] { "Id", "OwnerId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tests_Id_OwnerId",
                table: "Tests",
                columns: new[] { "Id", "OwnerId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TestsOptions_TestId",
                table: "TestsOptions",
                column: "TestId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuestionBasesWithQuestionCount");

            migrationBuilder.DropTable(
                name: "TestsOptions");

            migrationBuilder.DropTable(
                name: "Tests");

            migrationBuilder.DropIndex(
                name: "IX_QuestionBases_Id_OwnerId",
                table: "QuestionBases");
        }
    }
}
