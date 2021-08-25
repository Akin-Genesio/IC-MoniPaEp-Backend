import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class FAQSuggestions1625588123892 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "FAQSuggestions",
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
    await queryRunner.dropTable("FAQSuggestions")
  }
}
