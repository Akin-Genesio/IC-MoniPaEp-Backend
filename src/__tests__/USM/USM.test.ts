import request from "supertest"
import { getCustomRepository } from "typeorm"
import {app} from "../../app"
import {USMRepository} from "../../repositories"

import createConnection from "../../database"
let connection

describe("USM", () =>{
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()

    })

    afterAll(async () => {
        await connection.dropDatabase()
    })

    describe("Success Cases", () =>{
        it("Should create a valid USM", async () =>{
            const response = await request(app).post("/usm").send({
                name: "CreateTest",
                address: "13050023"
            })

            expect(response.status).toBe(201)
        })
    })
})