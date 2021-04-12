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
                        type: "uuid"
                    },
                    {
                        name: "date_start",
                        type: "datetime"
                    },
                    {
                        name: "diagnosis",
                        type: "varchar",
                        //default: "-"
                    },
                    {
                        name: "disease_name",
                        type: "varchar"
                    },
                    {
                        name: "status",
                        type: "varchar"
                    }
                ],
                foreignKeys: [
                    {
                        name: "FKPatient",
                        referencedTableName: "patients",
                        referencedColumnNames: ["id"],
                        columnNames:["patient_id"],
                        onUpdate: "CASCADE",
                        onDelete: "CASCADE"
                    },
                    {
                        name: "FKDisease",
                        referencedTableName: "disease",
                        referencedColumnNames: ["name"],
                        columnNames:["disease_name"],
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
