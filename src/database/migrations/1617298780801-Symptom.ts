import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Symptom1617298780801 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "symptom",
        columns: [
          {
            name: "symptom",
            type: "varchar",
            isPrimary: true,
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("symptom")
  }
}
