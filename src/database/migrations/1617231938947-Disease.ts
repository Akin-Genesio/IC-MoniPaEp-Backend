import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Disease1617231938947 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "disease",
        columns: [
          {
            name: "name",
            type: "varchar",
            isPrimary: true
          },
          {
            name: "infected_Monitoring_Days",
            type: "integer",
          },
          {
            name: "suspect_Monitoring_Days",
            type: "integer",
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable("disease")
  }
}
