import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class DiseaseOccurrence1617301039875 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "disease_occurrence",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "patient_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "disease_name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "diagnosis",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "date_start",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "date_end",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "status",
            type: "varchar",
            isNullable: false,
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
          },
          {
            name: "FKDisease",
            referencedTableName: "disease",
            referencedColumnNames: ["name"],
            columnNames: ["disease_name"],
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("disease_occurrence")
  }
}
