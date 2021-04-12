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

        it("Should return a list of all the USMs", async () =>{
            const response = await request(app).get("/usm").send()

            expect(response.status).toBe(200)
        })

        it("Should return a specific USM", async () =>{
            const usmRepository = getCustomRepository(USMRepository)

            const newUSM = await request(app).post("/usm").send({
                name: "getTest",
                address: "13050023"
            })
            
            const usm = await usmRepository.findOne({name: "getTest"})
            const response = await request(app).get(`/usm/${usm.name}`).send()

            expect(response.status).toBe(302)
        })

        it("Should be able to alter a specific USM", async () =>{
            const usmRepository = getCustomRepository(USMRepository)

            const newUSM = await request(app).post("/usm").send({
                name: "alterTest",
                address: "13050023"
            })
            
            const usm = await usmRepository.findOne({name: "alterTest"})
            const response = await request(app).put(`/usm/${usm.name}`).send({
                name: "alteredTest",
                address: "123"
            })

            expect(response.status).toBe(200)
        })

        it("Should be able to delete a specific USM", async () =>{
            const usmRepository = getCustomRepository(USMRepository)

            const newUSM = await request(app).post("/usm").send({
                name: "deleteTest",
                address: "13050023"
            })
            
            const usm = await usmRepository.findOne({name: "deleteTest"})
            const response = await request(app).delete(`/usm/${usm.name}`).send()

            expect(response.status).toBe(200)
        })
    })
})