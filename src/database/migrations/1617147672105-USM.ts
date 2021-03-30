import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class USM1617147672105 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "usm",
                columns:[
                    {
                        name: "name",
                        type: "string",
                        isPrimary: true
                    },
                    {
                        name: "address",
                        type: "string"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("usm")
    }

}
