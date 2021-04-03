import request from "supertest"
import {app} from "../app"

import createConnection from "../database"

describe("Patient", () => {
    beforeAll(async () => {
        const connection = await createConnection()
        await connection.runMigrations()
    })

    it("Should create a new patient", async() =>{

        const response = await request(app).post("/patients").send({
            name: "Akin",
            email: "akin2@email.com",
            lastGPSLocation: "123",
            allowSMS: true,
            workAddress: "321",
            homeAddress: "213",
            hasHealthPlan: false ,
            age: 23,
            status: "saudavel"
        })

        expect(response.status).toBe(201)
    })
})