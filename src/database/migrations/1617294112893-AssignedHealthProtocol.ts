import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class AssignedHealthProtocol1617294112893 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "assigned_healthprotocol",
                columns: [
                    {
                        name: "patient_id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "healthprotocol_id",
                        type: "uuid",
                        isPrimary: true
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
                        name: "FKHealthProtocol",
                        referencedTableName: "healthProtocols",
                        referencedColumnNames: ["id"],
                        columnNames: ["healthprotocol_id"],
                        onUpdate: "CASCADE",
                        onDelete: "CASCADE"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("assigned_healthprotocol")
    }

}
