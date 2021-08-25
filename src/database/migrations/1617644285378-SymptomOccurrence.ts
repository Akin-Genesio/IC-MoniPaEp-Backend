import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class SymptomOccurrence1617644285378 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "symptom_occurrence",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true
          },
          {
            name: "patient_id",
            type: "uuid",
            isNullable: false
          },
          {
            name: "symptom_name",
            type: "varchar",
            isNullable: false
          },
          {
            name: "disease_occurrence_id",
            type: "uuid",
            isNullable: true
          },
          {
            name: "registered_date",
            type: "datetime",
            isNullable: false
          }
        ],
        foreignKeys: [
          {
            name: "FK_patient_id",
            referencedTableName: "patients",
            referencedColumnNames: ["id"],
            columnNames: ["patient_id"],
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
          },
          {
            name: "FK_Symptom",
            referencedTableName: "symptom",
            referencedColumnNames: ["symptom"],
            columnNames: ["symptom_name"],
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
          },
          {
            name: "FK_Disease_Occurrence",
            referencedTableName: "disease_occurrence",
            referencedColumnNames: ["id"],
            columnNames: ["disease_occurrence_id"],
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
          },
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("symptom_occurrence")
  }
}
