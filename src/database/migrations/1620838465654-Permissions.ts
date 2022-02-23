import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Permissions1620838465654 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "permissions",
        columns: [
          {
            name: "userId",
            type: "uuid",
            isPrimary: true
          },
          {
            name: "authorized",
            type: "boolean",
            default: false
          },
          {
            name: "localAdm",
            type: "boolean",
            default: false
          },
          {
            name: "generalAdm",
            type: "boolean",
            default: false
          }
        ],
        foreignKeys: [
          {
            name: "FKUser",
            referencedTableName: "systemUser",
            referencedColumnNames: ["id"],
            columnNames: ["userId"],
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("permissions")
  }
}

