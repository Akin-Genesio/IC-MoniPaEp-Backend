import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class USM1617147672105 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "usm",
        columns: [
          {
            name: "name",
            type: "varchar",
            isPrimary: true
          },
          {
            name: "address",
            type: "varchar"
          },
          {
            name: "neighborhood",
            type: "varchar"
          },
          {
            name: "latitude",
            type: "decimal(8,6)"
          },
          {
            name: "longitude",
            type: "decimal(9,6)"
          },
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("usm")
  }
}
