using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EntityFixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UsedQuestionIds",
                table: "TestLogs");

            migrationBuilder.RenameColumn(
                name: "IsCorrect",
                table: "SelectedAnswers",
                newName: "Scored");

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartedAt",
                table: "TestSolvings",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "QuestionsDownloaded",
                table: "TestSolvings",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QuestionsDownloaded",
                table: "TestSolvings");

            migrationBuilder.RenameColumn(
                name: "Scored",
                table: "SelectedAnswers",
                newName: "IsCorrect");

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartedAt",
                table: "TestSolvings",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UsedQuestionIds",
                table: "TestLogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
