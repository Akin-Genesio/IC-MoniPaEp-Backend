import request from "supertest"
import {app} from "../app"

import createConnection from "../database"
let connection



describe("Patient", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()

    })

    afterAll(async () => {
        await connection.dropDatabase()
    })

    
    it("Should create a new patient", async() =>{

        const response = await request(app).post("/patients").send({
            name: "Akin",
            email: "akin@email.com",
            password: "123",
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