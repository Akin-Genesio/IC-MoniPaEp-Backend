import { PatientsRepository } from "../../repositories"
import request from "supertest"
import { getCustomRepository } from "typeorm"
import {app} from "../../app"

import createConnection from "../../database"
let connection

describe("Health Protocol", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()

    })

    afterAll(async () => {
        await connection.dropDatabase()
        await connection.close()
    })

    describe("Success Cases", () => {
        it("Should be able to create new health protocol", async () => {
            const response = await request(app).post("/healthprotocol").send({
                description: "PostTest"
            })
    
            expect(response.status).toBe(201)
        })
    
        it("Should be able to return a list with all the health protocols", async () => {
            const response = await request(app).get("/healthprotocol").send()
    
            expect(response.status).toBe(200)
        })
    
        it("Should be able to return a specific health protocol searching by the description", async () => {
            const test = "GetTest"
            const health = await request(app).post("/healthprotocol").send({
                description: test
            })
    
            const response = await request(app).get(`/healthprotocol/${test}`).send()
    
            expect(response.status).toBe(302)
        })
    
        it("Should be able to alter a specific health protocol searching by the description", async () => {
            const test = "PutTest"
            const health = await request(app).post("/healthprotocol").send({
                description: test
            })
    
            const response = await request(app).put(`/healthprotocol/${test}`).send({
                description: "altered"
            })
    
            expect(response.status).toBe(200)
        })
    
        it("Should be able to delete a specific health protocol searching by the description", async () => {
            const test = "DeleteTest"
            const health = await request(app).post("/healthprotocol").send({
                description: test
            })
    
            const response = await request(app).delete(`/healthprotocol/${test}`).send()
    
            expect(response.status).toBe(200)
        })
    })

    describe("Failure Cases", () => {
        it("Should return error message if try to create a health protocol with a description already registered", async () => {
            const helath = await request(app).post("/healthprotocol").send({
                description: "PostTest"
            })

            const response = await request(app).post("/healthprotocol").send({
                description: "PostTest"
            })
    
            expect(response.status).toBe(400)
        })

        it("Should return error message if try to get a health protocol not registered", async () => {
            const test = "123"
            const response = await request(app).get(`/healthprotocol/${test}`).send()
    
            expect(response.status).toBe(404)
        })

        it("Should return error message if try to alter a health protocol not registered", async () => {
            const test = "123"
            const response = await request(app).put(`/healthprotocol/${test}`).send({
                description: "PostTest"
            })
    
            expect(response.status).toBe(404)
        })

        it("Should return error message if try to delete a health protocol not registered", async () => {
            const test = "123"
            const response = await request(app).delete(`/healthprotocol/${test}`).send()
    
            expect(response.status).toBe(404)
        })
    })
})