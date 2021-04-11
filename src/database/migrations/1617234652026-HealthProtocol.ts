import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class HealthProtocol1617234652026 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "healthProtocols",
                columns:[
                    {
                        name: "description",
                        type: "varchar",
                        isPrimary: true
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("healthProtocols")
    }

}
