import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class AboutTheApp1678309194563 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "about",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true, 
                    },
                    {
                        name: "main",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "secundary",
                        type: "varchar",
                        isNullable: false,
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("about")

    }

}
