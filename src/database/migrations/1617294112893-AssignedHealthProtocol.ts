import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class AssignedHealthProtocol1617294112893 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "assigned_healthprotocol",
                columns: [
                    {
                        name: "disease_name",
                        type: "varchar",
                        isPrimary: true
                    },
                    {
                        name: "healthprotocol_description",
                        type: "varchar",   
                        isPrimary: true
                    }
                ],
                foreignKeys: [
                    {
                        name: "FKDisease",
                        referencedTableName: "disease",
                        referencedColumnNames: ["name"],
                        columnNames: ["disease_name"],
                        onUpdate: "CASCADE",
                        onDelete: "CASCADE"
                    },
                    {
                        name: "FKHealthProtocol",
                        referencedTableName: "healthProtocols",
                        referencedColumnNames: ["description"],
                        columnNames: ["healthprotocol_description"],
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
