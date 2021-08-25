import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class RefreshTokens1629164153064 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "refresh_token",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true
          },
          {
            name: "expiresIn",
            type: "integer",
          },
          {
            name: "patientId",
            type: "uuid",
            isNullable: true
          },
          {
            name: "systemUserId",
            type: "uuid",
            isNullable: true
          },
        ],
        foreignKeys: [
          {
            name: "FK_patient_id",
            referencedTableName: "patients",
            referencedColumnNames: ["id"],
            columnNames: ["patientId"],
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
          },
          {
            name: "FK_system_user_id",
            referencedTableName: "systemUser",
            referencedColumnNames: ["id"],
            columnNames: ["systemUserId"],
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
          },
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("refresh_token")
  }
}
