import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class FAQ1616612952311 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "FAQ",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true
          },
          {
            name: "question",
            type: "varchar",
            isUnique: true
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
