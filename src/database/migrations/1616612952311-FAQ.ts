import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class FAQ1616612952311 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "FAQ",
        columns: [
          {
            name: "question",
            type: "varchar",
            isPrimary: true
          },
          {
            name: "answer",
            type: "varchar",
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("FAQ")
  }
}
