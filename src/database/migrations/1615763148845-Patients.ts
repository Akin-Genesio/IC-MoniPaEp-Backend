import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Patients1615763148845 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
           new Table({
               name: "patients",
               columns: [
                   {
                       name: "id",
                       type: "uuid",
                       isPrimary: true,
                   },
                   {
                       name: "name",
                       type: "varchar",
                       isNullable: false,
                   },
                   {
                       name: "password",
                       type: "varchar",
                       isNullable: false
                   },
                   {
                       name: "CPF",
                       type: "varchar",
                       isUnique: true,
                       isNullable: false
                   },
                   {
                       name: "email",
                       type: "varchar",
                       isUnique: true,
                       isNullable: false
                   },
                   {
                       name: "lastGPSLocation",
                       type: "varchar",
                   },
                   {
                       name: "allowSMS",
                       type: "boolean",
                   },
                   {
                       name: "workAddress",
                       type: "varchar"
                   },
                   {
                       name: "homeAddress",
                       type: "varchar"
                   },
                   {
                       name: "hasHealthPlan",
                       type: "boolean"
                   },
                   {
                       name: "age",
                       type: "number"
                   },
                   {
                       name: "status",
                       type: "varchar"
                   }
               ]
           }) 
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("patients")
    }

}
