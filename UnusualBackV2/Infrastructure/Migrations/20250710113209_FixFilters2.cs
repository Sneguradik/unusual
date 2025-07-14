using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixFilters2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Filters_Presets_PresetId",
                table: "Filters");

            migrationBuilder.DropForeignKey(
                name: "FK_Filters_Presets_PresetId1",
                table: "Filters");

            migrationBuilder.DropIndex(
                name: "IX_Filters_PresetId1",
                table: "Filters");

            migrationBuilder.DropColumn(
                name: "PresetId1",
                table: "Filters");

            migrationBuilder.AlterColumn<int>(
                name: "PresetId",
                table: "Filters",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Filters_Presets_PresetId",
                table: "Filters",
                column: "PresetId",
                principalTable: "Presets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Filters_Presets_PresetId",
                table: "Filters");

            migrationBuilder.AlterColumn<int>(
                name: "PresetId",
                table: "Filters",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "PresetId1",
                table: "Filters",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Filters_PresetId1",
                table: "Filters",
                column: "PresetId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Filters_Presets_PresetId",
                table: "Filters",
                column: "PresetId",
                principalTable: "Presets",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Filters_Presets_PresetId1",
                table: "Filters",
                column: "PresetId1",
                principalTable: "Presets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
