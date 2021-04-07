import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class SymptomOccurrence1617644285378 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "symptom_occurrence",
                columns: [
                    {
                        name: "disease_occurrence_id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "symptom_name",
                        type: "varchar",
                        isPrimary: true
                    },
                    {
                        name: "registered_date",
                        type: "datetime"
                    }
                ],
                foreignKeys: [
                    {
                        name: "FK_Disease_Occurrence",
                        referencedTableName: "disease_occurrence",
                        referencedColumnNames: ["id"],
                        columnNames: ["disease_occurrence_id"],
                        onUpdate: "CASCADE",
                        onDelete: "CASCADE"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("symptom_occurrence")
    }

}
