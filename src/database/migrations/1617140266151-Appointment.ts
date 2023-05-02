import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Appointment1617140266151 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "appointments",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "date",
            type: "timestamp",
          },
          {
            name: "whenRemember",
            type: "timestamp",
          },
          {
            name: "location",
            type: "varchar",
          },
          {
            name: "type",
            type: "varchar",
          },
          {
            name: "patient_id",
            type: "uuid"
          }
        ],
        foreignKeys: [
          {
            name: "FKPatient",
            referencedTableName: "patients",
            referencedColumnNames: ["id"],
            columnNames: ["patient_id"],
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable("appointments")
  }
}
