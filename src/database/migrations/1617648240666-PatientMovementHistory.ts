import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class PatientMovementHistory1617648240666 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "patient_movement_history",
                columns: [
                    {
                        name: "description",
                        type: "varchar",
                        isPrimary: true
                    },
                    {
                        name: "disease_occurrence_id",
                        type: "uuid",
                        isPrimary: true
                    }
                ],
                foreignKeys: [
                    {
                        name: "FK_disease_occurrence",
                        referencedTableName: "disease_occurrence",
                        referencedColumnNames: ["id"],
                        columnNames: ["disease_occurrence_id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("patient_movement_history")
    }

}
