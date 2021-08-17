import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class SystemUser1620150820274 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "systemUser",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false
          },
          {
            name: "CPF",
            type: "varchar",
            isNullable: false,
            isUnique: true
          },
          {
            name: "email",
            type: "varchar",
            isNullable: false,
            isUnique: true
          },
          {
            name: "password",
            type: "varchar",
            isNullable: false
          },
          {
            name: "department",
            type: "varchar",
            isNullable: false
          },
          {
            name: "createdAt",
            type: "datetime"
          },
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("systemUser")
  }

}
