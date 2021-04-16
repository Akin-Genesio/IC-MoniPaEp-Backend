import request from "supertest"
import { getCustomRepository } from "typeorm"
import {app} from "../../app"
import {PatientsRepository, USMRepository, VaccinesRepository} from "../../repositories"

import createConnection from "../../database"
let connection

describe("Vaccine", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()

    })

    afterAll(async () => {
        await connection.dropDatabase()
    })

    describe("Success Cases", () => {
        it("Should be able to create new valid vaccine", async () => {
            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "postvacinetest@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })
            
            const patient = await patientsRepository.findOne({email: "postvacinetest@email.com"})

            const usm = await request(app).post("/usm").send({
                name: "TestVaccinePost",
                address: "13050023"
            })


            const response = await request(app).post("/vaccine").send({
                date: "10-12-2021",
                type: "PostTest",
                patient_id: `${patient.id}`,
                usm_name: "TestVaccinePost"
            })

            expect(response.status).toBe(201)
        })

        it("Should return a list of all the vaccines registered", async () =>{
            const response = await request(app).get("/vaccine").send()

            expect(response.status).toBe(200)
        })

        it("Should be able to return a vaccine searching by id", async () => {
            const patientsRepository = getCustomRepository(PatientsRepository)
            const vaccineRepository = getCustomRepository(VaccinesRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "getvacinetest@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })
            
            const patient = await patientsRepository.findOne({email: "getvacinetest@email.com"})

            const usm = await request(app).post("/usm").send({
                name: "TestVaccineGet",
                address: "13050023"
            })

            const vaccinePost = await request(app).post("/vaccine").send({
                date: "10-12-2021",
                type: "PostTest",
                patient_id: `${patient.id}`,
                usm_name: "TestVaccineGet"
            })

            const vaccine = await vaccineRepository.findOne({
                patient_id: `${patient.id}`,
                usm_name: "TestVaccineGet"
            })

            const response = await request(app).get(`/vaccine/${vaccine.id}`).send()

            expect(response.status).toBe(302)
        })

        it("Should be able to alter a vaccine searching by id", async () => {
            const patientsRepository = getCustomRepository(PatientsRepository)
            const vaccineRepository = getCustomRepository(VaccinesRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "altervacinetest@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })
            
            const patient = await patientsRepository.findOne({email: "altervacinetest@email.com"})

            const usm = await request(app).post("/usm").send({
                name: "TestVaccineAlter",
                address: "13050023"
            })

            const vaccinePost = await request(app).post("/vaccine").send({
                date: "10-12-2021",
                type: "PostTest",
                patient_id: `${patient.id}`,
                usm_name: "TestVaccineAlter"
            })

            const vaccine = await vaccineRepository.findOne({
                patient_id: `${patient.id}`,
                usm_name: "TestVaccineAlter"
            })

            const response = await request(app).put(`/vaccine/${vaccine.id}`).send({
                date: "10-12-2021",
                type: "Altered",
                patient_id: `${patient.id}`,
                usm_name: "TestVaccineAlter"
            })

            expect(response.status).toBe(200)
        })

        it("Should be able to delete a vaccine searching by id", async () => {
            const patientsRepository = getCustomRepository(PatientsRepository)
            const vaccineRepository = getCustomRepository(VaccinesRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "deletevacinetest@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })
            
            const patient = await patientsRepository.findOne({email: "deletevacinetest@email.com"})

            const usm = await request(app).post("/usm").send({
                name: "TestVaccineDelete",
                address: "13050023"
            })

            const vaccinePost = await request(app).post("/vaccine").send({
                date: "10-12-2021",
                type: "PostTest",
                patient_id: `${patient.id}`,
                usm_name: "TestVaccineDelete"
            })

            const vaccine = await vaccineRepository.findOne({
                patient_id: `${patient.id}`,
                usm_name: "TestVaccineDelete"
            })

            const response = await request(app).delete(`/vaccine/${vaccine.id}`).send()

            expect(response.status).toBe(200)
        })
    })


    describe("Failure Cases", () => {
        it("Should return error if try to register a vaccine with a invalid patient_id", async () => {
            const response = await request(app).post("/vaccine").send({
                date: "10-12-2021",
                type: "PostTest",
                patient_id: `123`,
                usm_name: "TestVaccinePost"
            })

            expect(response.status).toBe(404)
        })

        it("Should return error if try to register a vaccine with a invalid usm_name", async () => {
            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "posterrorvacinetest@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })
            
            const patient = await patientsRepository.findOne({email: "posterrorvacinetest@email.com"})
            const response = await request(app).post("/vaccine").send({
                date: "10-12-2021",
                type: "PostTest",
                patient_id: `${patient.id}`,
                usm_name: "TestErrorVaccinePost"
            })

            expect(response.status).toBe(404)
        })

        it("Should return error if try to get a vaccine that is not registered", async () => {
            const patientsRepository = getCustomRepository(PatientsRepository)
            const response = await request(app).get("/vaccine/123").send()

            expect(response.status).toBe(404)
        })

        it("Should return error if try to alter a vaccine that is not registered", async () => {
            const patientsRepository = getCustomRepository(PatientsRepository)
            const response = await request(app).get("/vaccine/123").send({
                date: "10-12-2021",
                type: "PostTest",
                patient_id: `123`,
                usm_name: "TestErrorVaccinePost"
            })

            expect(response.status).toBe(404)
        })

        it("Should return error if try to delete a vaccine that is not registered", async () => {
            const patientsRepository = getCustomRepository(PatientsRepository)
            const response = await request(app).delete("/vaccine/123").send()

            expect(response.status).toBe(404)
        })
    })
})