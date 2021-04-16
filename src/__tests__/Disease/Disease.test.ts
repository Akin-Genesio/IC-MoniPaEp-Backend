import request from "supertest"
import { getCustomRepository } from "typeorm"
import {app} from "../../app"
import {USMRepository} from "../../repositories"

import createConnection from "../../database"
let connection


describe("Disease", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()

    })

    afterAll(async () => {
        await connection.dropDatabase()
    })

    describe("Success Cases", () => {
        it("Should create a valid new Disease", async () => {
            const response = await request(app).post("/disease").send({
                name: "PostTest",
                infected_Monitoring_Days: 15,
                suspect_Monitoring_Days: 15
            })

            expect(response.status).toBe(201)
        })

        it("Should a list with all diseases registered", async () => {
            const response = await request(app).get("/disease").send()

            expect(response.status).toBe(200)
        })

        it("Should be able to return one specified disease searching by the name", async () => {
            const testName = "GetOneTest"
            const test = await request(app).post("/disease").send({
                name: testName,
                infected_Monitoring_Days: 15,
                suspect_Monitoring_Days: 15
            })

            const response = await request(app).get(`/disease/${testName}`).send()

            expect(response.status).toBe(302)
        })

        it("Should be able to alter one specified disease searching by the name", async () => {
            const testName = "PutTest"
            const test = await request(app).post("/disease").send({
                name: testName,
                infected_Monitoring_Days: 15,
                suspect_Monitoring_Days: 15
            })

            const response = await request(app).put(`/disease/${testName}`).send({
                name: "Altered",
                infected_Monitoring_Days: 15,
                suspect_Monitoring_Days: 15
            })

            expect(response.status).toBe(200)
        })

        it("Should be able to delete one specified disease searching by the name", async () => {
            const testName = "DeleteTest"
            const test = await request(app).post("/disease").send({
                name: testName,
                infected_Monitoring_Days: 15,
                suspect_Monitoring_Days: 15
            })

            const response = await request(app).delete(`/disease/${testName}`).send()

            expect(response.status).toBe(200)
        })
    })

    describe("Failure Cases", ()=>{
        it("Should return error if try to create new Disease with a name already registered", async () => {
            const test = await request(app).post("/disease").send({
                name: "FailurePostTest",
                infected_Monitoring_Days: 15,
                suspect_Monitoring_Days: 15
            })

            const response = await request(app).post("/disease").send({
                name: "FailurePostTest",
                infected_Monitoring_Days: 15,
                suspect_Monitoring_Days: 15
            })

            expect(response.status).toBe(400)
        })

        it("Should return error if try to get a disease that doesn't exist'", async () => {
            const response = await request(app).get("/disease/FailureGetOneTest").send()

            expect(response.status).toBe(404)
        })

        it("Should return error if try to alter a disease that doesn't exist'", async () => {
            const response = await request(app).put("/disease/FailurePutTest").send({
                name: "FailurePostTest",
                infected_Monitoring_Days: 15,
                suspect_Monitoring_Days: 15
            })

            expect(response.status).toBe(404)
        })

        it("Should return error if try to delete a disease that doesn't exist'", async () => {
            const response = await request(app).delete("/disease/FailureDeleteTest").send()

            expect(response.status).toBe(404)
        })
    })
})