import { PatientsRepository } from "../../repositories"
import request from "supertest"
import { getCustomRepository } from "typeorm"
import {app} from "../../app"

import createConnection from "../../database"
let connection



describe("Patient", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()

    })

    afterAll(async () => {
        await connection.dropDatabase()
        await connection.close()
    })

    
    describe("Success Cases", () => {
        it("Should create a new patient", async() =>{

            const response = await request(app).post("/patients").send({
                name: "Akin",
                email: "akin@email.com",
                password: "123456789",
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

        it("Should return the list of patients", async() =>{

            const response = await request(app).get("/patients").send()
    
            expect(response.status).toBe(200)
        })

        it("Should return one specified patient based on his id", async() =>{

            const addOne = await request(app).post("/patients").send({
                name: "Test",
                email: "Test@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patientsRepository = getCustomRepository(PatientsRepository)
            const patient = await patientsRepository.findOne({email: "Test@email.com"})

            const response = await request(app).get(`/patients/${patient.id}`).send()
    
            expect(response.status).toBe(302)
        })

        it("Should alter one specified patient searching for his id", async() =>{

            const addOne = await request(app).post("/patients").send({
                name: "Test",
                email: "Test.alter@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patientsRepository = getCustomRepository(PatientsRepository)
            const patient = await patientsRepository.findOne({email: "Test@email.com"})

            const response = await request(app).put(`/patients/${patient.id}`).send({
                name: "Test",
                email: "Test.altered@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: true ,
                age: 25,
                status: "sick"
            })
    
            expect(response.status).toBe(200)
        })

        it("Should delete one specified patient based on his id", async() =>{

            const addOne = await request(app).post("/patients").send({
                name: "Test",
                email: "Test.delete@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patientsRepository = getCustomRepository(PatientsRepository)
            const patient = await patientsRepository.findOne({email: "Test.delete@email.com"})

            const response = await request(app).delete(`/patients/${patient.id}`).send()
    
            expect(response.status).toBe(200)
        })
    })

    describe("Failure Cases", ()=>{
        it("Should create a new patient", async() =>{

            const equal = await request(app).post("/patients").send({
                name: "createfail",
                email: "createfail@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const response = await request(app).post("/patients").send({
                name: "createfail",
                email: "createfail@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })
    
            expect(response.status).toBe(400)
        })

    })

    describe("Failure Cases", ()=>{
        it("Should not create a new patient if the email is equal to a patient registered email", async() =>{

            const equal = await request(app).post("/patients").send({
                name: "createfail",
                email: "createfail@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const response = await request(app).post("/patients").send({
                name: "createfail",
                email: "createfail@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })
    
            expect(response.status).toBe(400)
        })

        it("Should return a message error if try get one not existent patient", async() =>{

            const response = await request(app).get(`/patients/${123}`).send()
    
            expect(response.status).toBe(404)
        })

        it("Should return a message error if try to alter one patient unregistered", async() =>{

            const response = await request(app).put(`/patients/${321}`).send({
                name: "createfail",
                email: "createfail@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })
    
            expect(response.status).toBe(404)
        })

        it("Should return a message error if try to delete one patient unregistered", async() =>{

            const response = await request(app).delete(`/patients/${321}`).send()
    
            expect(response.status).toBe(404)
        })
    })
    
})