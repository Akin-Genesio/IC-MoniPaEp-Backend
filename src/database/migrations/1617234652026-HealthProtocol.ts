import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class HealthProtocol1617234652026 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "healthProtocols",
                columns:[
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "description",
                        type: "varchar",
                    },
                    {
                        name: "disease_name",
                        type: "varchar"
                    }
                ],
                foreignKeys:[
                    {
                        name: "FKDisease",
                        referencedTableName: "disease",
                        referencedColumnNames: ["name"],
                        columnNames:["disease_name"],
                        onUpdate: "CASCADE",
                        onDelete: "CASCADE"
                    },
                ]

            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("healthProtocols")
    }

}
