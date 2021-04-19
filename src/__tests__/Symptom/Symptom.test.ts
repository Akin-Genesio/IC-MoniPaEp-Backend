import request from "supertest"
import { getCustomRepository } from "typeorm"
import {app} from "../../app"

import {SymptomRepository} from "../../repositories"

import createConnection from "../../database"
let connection

describe("Symptom", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()
    })

    afterAll(async () => {
        await connection.dropDatabase()
    })
    
    describe("Success Cases", () => {
        it("Should create a new symptom", async () => {
            const response = await request(app).post("/symptom").send({
                symptom: "Symptom test"
            })

            expect(response.status).toBe(201)
        })

        it("Should return a list of all symptoms registered", async () => {
            const response = await request(app).get("/symptom").send()

            expect(response.status).toBe(200)
        })

        it("Should return a specific symptom", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)

            const newSymptom = await request(app).post("/symptom").send({
                symptom: "Symptom test 2"
            })

            const symptom = await symptomRepository.findOne({symptom: "Symptom test 2"})
            
            const response = await request(app).get(`/symptom?symptom_name=${symptom.symptom}`).send()

            expect(response.status).toBe(200)
        })

        it("Should alter a specific symptom", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)

            const newSymptom = await request(app).post("/symptom").send({
                symptom: "Symptom test 3"
            })

            const symptom = await symptomRepository.findOne({symptom: "Symptom test 3"})
            
            const response = await request(app).put(`/symptom/${symptom.symptom}`).send({
                symptom: "Symptom test 3 modified"
            })

            expect(response.status).toBe(200)
        })

        it("Should delete a specific symptom", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)

            const newSymptom = await request(app).post("/symptom").send({
                symptom: "Symptom test 4"
            })

            const symptom = await symptomRepository.findOne({symptom: "Symptom test 4"})
            
            const response = await request(app).delete(`/symptom/${symptom.symptom}`).send()

            expect(response.status).toBe(200)
        })
    })
    describe("Failure Cases", () => {
        it("Should not create a symptom if it has already been registered", async () => {
            const response = await request(app).post("/symptom").send({
                symptom: "Symptom test failure"
            })

            const secondResponse = await request(app).post("/symptom").send({
                symptom: "Symptom test failure"
            })
            expect(secondResponse.status).toBe(406)
        })

        it("Should return error when trying to get a symptom that does not exist", async () => {
            const response = await request(app).get("/symptom?symptom_name=symptomTest").send()

            expect(response.status).toBe(404)
        })

        it("Should return error when trying to alter a symptom that does not exist", async () => {
            const response = await request(app).put("/symptom/symptomTest").send({
                symptom: "Symptom testing"
            })

            expect(response.status).toBe(404)
        })

        it("Should return error when trying to delete a symptom that does not exist", async () => {
            const response = await request(app).delete("/symptom/symptomTest").send()

            expect(response.status).toBe(404)
        })
    })
        

})