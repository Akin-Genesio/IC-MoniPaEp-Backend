import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class HealthProtocol1617288387958 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "healthprotocol",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "disease_name",
                        type: "varchar"
                    },
                    {
                        name: "description",
                        type: "varchar"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("healthprotocol")
    }

}
