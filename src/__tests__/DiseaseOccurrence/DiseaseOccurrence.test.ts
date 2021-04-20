import request from "supertest"
import { getCustomRepository } from "typeorm"
import {app} from "../../app"

import {DiseaseOccurrenceRepository, DiseaseRepository, PatientsRepository} from "../../repositories"

import createConnection from "../../database"
let connection

describe("DiseaseOccurrence", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()
    })

    afterAll(async () => {
        await connection.dropDatabase()
    })
    
    describe("Success Cases", () => {
        it("Should create a new disease occurrence specified by disease and patient", async () => {
            
            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "test@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patient = await patientsRepository.findOne({email: "test@email.com"})

            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test"
            })
            
            const response = await request(app).post("/diseaseoccurrence").send({
                disease_name: `${disease.name}`,
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })
            
            expect(response.status).toBe(201)
        })

        it("Should return all symptom occurrences registered", async () => {
            const response = await request(app).get("/diseaseoccurrence").send()

            expect(response.status).toBe(200)
        })
        
        it("Should return the symptom occurrences filtered by a specific disease occurrence and/or symptom", async () => {

            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "test2@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patient = await patientsRepository.findOne({email: "test2@email.com"})

            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test2",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test2"
            })
            
            const postDiseaseOccurrence = await request(app).post("/diseaseoccurrence").send({
                disease_name: `${disease.name}`,
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })
            
            const response = await request(app).get(
                `/diseaseoccurrence?patient_id=${patient.id}&disease_name=${disease.name}`
                )
            

            expect(response.status).toBe(200)
            
        })

        it("Should return a symptom occurrence specified", async () => {

            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "test3@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patient = await patientsRepository.findOne({email: "test3@email.com"})

            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test3",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test3"
            })
            
            const postDiseaseOccurrence = await request(app).post("/diseaseoccurrence").send({
                disease_name: `${disease.name}`,
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })
            
            const response = await request(app).get(
                `/diseaseoccurrence/${postDiseaseOccurrence.body.id}`
            )

            expect(response.status).toBe(200)
            
        })

        it("Should alter a symptom occurrence specified", async () => {

            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "test4@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patient = await patientsRepository.findOne({email: "test4@email.com"})

            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test4",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test4"
            })
            
            const postDiseaseOccurrence = await request(app).post("/diseaseoccurrence").send({
                disease_name: `${disease.name}`,
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })
            
            const response = await request(app).put(
                `/diseaseoccurrence/${postDiseaseOccurrence.body.id}`
            ).send({
                status: "Curado"
            })

            expect(response.status).toBe(200)
            
        })

        it("Should delete a symptom occurrence specified", async () => {

            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "test5@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patient = await patientsRepository.findOne({email: "test5@email.com"})

            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test5",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test5"
            })
            
            const postDiseaseOccurrence = await request(app).post("/diseaseoccurrence").send({
                disease_name: `${disease.name}`,
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })
            
            const response = await request(app).delete(
                `/diseaseoccurrence/${postDiseaseOccurrence.body.id}`
            )

            expect(response.status).toBe(200)
            
        })
    })
    describe("Failure Cases", () => {
        it("Should not create a new disease occurrence if it the patient id is not valid", async () => {

            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "test6@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patient = await patientsRepository.findOne({email: "test6@email.com"})

            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test6",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test6"
            })
            
            const postDiseaseOccurrence = await request(app).post("/diseaseoccurrence").send({
                disease_name: `${disease.name}`,
                patient_id: "invalidPatientId",
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })
            
            expect(postDiseaseOccurrence.status).toBe(404)
        })

        it("Should not create a new disease occurrence if it the disease name is not valid", async () => {

            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "test7@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patient = await patientsRepository.findOne({email: "test7@email.com"})

            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test7",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test7"
            })
            
            const postDiseaseOccurrence = await request(app).post("/diseaseoccurrence").send({
                disease_name: "invalidDisease",
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })
            
            expect(postDiseaseOccurrence.status).toBe(404)
        })

        it("Should return error when trying to get the disease occurrences filtered by an invalid disease name", async () => {

            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "test8@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patient = await patientsRepository.findOne({email: "test8@email.com"})

            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test8",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test8"
            })
            
            const postDiseaseOccurrence = await request(app).post("/diseaseoccurrence").send({
                disease_name: `${disease.name}`,
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })

            const response = await request(app).get(`/diseaseoccurrence?disease_name=invalidDiseaseTest`)
            
            expect(response.status).toBe(404)
        })

        it("Should return error when trying to get the disease occurrences filtered by an invalid patient id", async () => {

            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "test9@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patient = await patientsRepository.findOne({email: "test9@email.com"})

            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test9",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test9"
            })
            
            const postDiseaseOccurrence = await request(app).post("/diseaseoccurrence").send({
                disease_name: `${disease.name}`,
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })
            
            const response = await request(app).get(`/diseaseoccurrence?patient_id=invalidPatientTest`)
            
            expect(response.status).toBe(404)
        })

        it("Should return error when trying to alter a disease occurrence that does not exist", async () => {

            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "test11@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patient = await patientsRepository.findOne({email: "test11@email.com"})

            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test11",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test11"
            })
            
            const postDiseaseOccurrence = await request(app).post("/diseaseoccurrence").send({
                disease_name: `${disease.name}`,
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })
            
            const response = await request(app).put(
                `/diseaseoccurrence/invalidDiseaseOccurrenceTest`
            ).send({
                status: "Curado"
            })
            
            expect(response.status).toBe(404)
        })

        it("Should return error when trying to alter a disease occurrence that does not exist", async () => {

            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "test12@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patient = await patientsRepository.findOne({email: "test12@email.com"})

            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test12",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test12"
            })
            
            const postDiseaseOccurrence = await request(app).post("/diseaseoccurrence").send({
                disease_name: `${disease.name}`,
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })
            
            const response = await request(app).delete(
                `/diseaseoccurrence/invalidDiseaseOccurrenceTest`
            )
            
            expect(response.status).toBe(404)
        })
        
    })
        

})