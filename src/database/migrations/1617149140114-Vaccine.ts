import { query } from "express";
import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Vaccine1617149140114 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "vaccine",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "date",
                        type: "datetime",
                    },
                    {
                        name: "type",
                        type: "string"
                    },
                    {
                        name: "patient_id",
                        type: "uuid"
                    },
                    {
                        name: "usm_name",
                        type: "string"
                    }
                ],
                foreignKeys:[
                    {
                        name: "FKPatient",
                        referencedTableName: "patients",
                        referencedColumnNames: ["id"],
                        columnNames:["patient_id"],
                        onUpdate: "CASCADE",
                        onDelete: "CASCADE"
                    },
                    {
                        name: "FKUSM",
                        referencedTableName: "usm",
                        referencedColumnNames: ["name"],
                        columnNames:["usm_name"],
                        onUpdate: "CASCADE",
                        onDelete: "CASCADE"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("vaccine")
    }

}
