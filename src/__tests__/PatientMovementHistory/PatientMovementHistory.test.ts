import request from "supertest"
import { getCustomRepository } from "typeorm"
import {app} from "../../app"

import {DiseaseOccurrenceRepository, DiseaseRepository, PatientsRepository, PatientMovementHistoryRepository} from "../../repositories"

import createConnection from "../../database"
let connection

describe("PatientMovementHistory", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()
    })

    afterAll(async () => {
        await connection.dropDatabase()
    })
    
    describe("Success Cases", () => {
        it("Should link a new patient movement to a disease occurrence", async () => {
            
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
            
            const diseaseOccurr = await request(app).post("/diseaseoccurrence").send({
                disease_name: `${disease.name}`,
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })

            const response = await request(app).post("/patientmovementhistory").send({
                disease_occurrence_id: diseaseOccurr.body.id,
                description: "descriptionTest"
            })
            
            expect(response.status).toBe(201)
        })

        it("Should return the whole history registered", async () => {
            const response = await request(app).get("/patientmovementhistory").send()

            expect(response.status).toBe(200)
        })
        
        it("Should return the movement history filtered by a specific disease occurrence and/or description", async () => {

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

            console.log(postDiseaseOccurrence.body)

            const patientMovement = await request(app).post("/patientmovementhistory").send({
                disease_occurrence_id: postDiseaseOccurrence.body.id,
                description: "descriptionTest"
            })
            const patientMovementHistoryRepository = getCustomRepository(PatientMovementHistoryRepository)
            const patientFound = await patientMovementHistoryRepository.findOne({
                disease_occurrence_id: postDiseaseOccurrence.body.id,
                description: "descriptionTest"
            })

            const response = await request(app).get(
                `/patientmovementhistory?disease_occurrence_id=${patientFound.disease_occurrence_id}&description=${patientFound.description}`
            )
            
            expect(response.status).toBe(200)
            
            
        })
        
        it("Should alter a patient movement history specified", async () => {

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

            const patientMovement = await request(app).post("/patientmovementhistory").send({
                disease_occurrence_id: postDiseaseOccurrence.body.id,
                description: "descriptionTest"
            })
            
            const response = await request(app).put(
                `/patientmovementhistory/${patientMovement.body.disease_occurrence_id}/${patientMovement.body.description}`
            ).send({
                description: "DescriptionTest"
            })

            expect(response.status).toBe(200)
            
        })
        
        it("Should delete patient movement history specified", async () => {

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
            
            const patientMovement = await request(app).post("/patientmovementhistory").send({
                disease_occurrence_id: postDiseaseOccurrence.body.id,
                description: "descriptionTest"
            })
            
            const response = await request(app).delete(
                `/patientmovementhistory/${patientMovement.body.disease_occurrence_id}/${patientMovement.body.description}`
            ).send()

            expect(response.status).toBe(200)
            
        })
    })
    describe("Failure Cases", () => {
        it("Should not register a new movement history if it the disease occurrence id is not valid", async () => {

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

            const response = await request(app).post("/patientmovementhistory").send({
                disease_occurrence_id: "invalidId-Test",
                description: "descriptionTest"
            })
            
            expect(response.status).toBe(404)
        })

        it("Should return error when trying to get the patient movement history filtered by an invalid disease occurrence id", async () => {

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

            const patientMovement = await request(app).post("/patientmovementhistory").send({
                disease_occurrence_id: `${postDiseaseOccurrence.body.id}`,
                description: "descriptionTest"
            })

            const response = await request(app).get(
                `/patientmovementhistory?disease_occurrence_id=InvalidId`
            )
            
            expect(response.status).toBe(404)
        })
        
        it("Should return error when trying to alter a movement history that does not exist", async () => {

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
            
            const patientMovement = await request(app).post("/patientmovementhistory").send({
                disease_occurrence_id: postDiseaseOccurrence.body.id,
                description: "descriptionTest2"
            })
            
            const response = await request(app).put(
                `/patientmovementhistory/${patientMovement.body.disease_occurrence_id}/descriptionTest`
            ).send({
                description: "DescriptionTest"
            })

            expect(response.status).toBe(404)
        })

        it("Should return error when trying to alter a movement history with an invalid disease occurrence id", async () => {

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
            
            const patientMovement = await request(app).post("/patientmovementhistory").send({
                disease_occurrence_id: postDiseaseOccurrence.body.id,
                description: "descriptionTest3"
            })
            
            const response = await request(app).put(
                `/patientmovementhistory/invalidId/${patientMovement.body.description}`
            ).send({
                description: "DescriptionTest"
            })

            expect(response.status).toBe(404)
        })
        
        it("Should return error when trying to delete a movement history that does not exist", async () => {
            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "test13@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patient = await patientsRepository.findOne({email: "test13@email.com"})

            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test13",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test13"
            })
            
            const postDiseaseOccurrence = await request(app).post("/diseaseoccurrence").send({
                disease_name: `${disease.name}`,
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })
            
            const patientMovement = await request(app).post("/patientmovementhistory").send({
                disease_occurrence_id: postDiseaseOccurrence.body.id,
                description: "descriptionTest5"
            })
            
            const response = await request(app).delete(
                `/patientmovementhistory/${patientMovement.body.disease_occurrence_id}/descriptionTest`
            ).send()

            expect(response.status).toBe(404)
        })
        
        it("Should return error when trying to delete a movement history with an invalid disease occurrence id", async () => {

            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "test15@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patient = await patientsRepository.findOne({email: "test15@email.com"})

            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test15",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test15"
            })
            
            const postDiseaseOccurrence = await request(app).post("/diseaseoccurrence").send({
                disease_name: `${disease.name}`,
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })
            
            const patientMovement = await request(app).post("/patientmovementhistory").send({
                disease_occurrence_id: postDiseaseOccurrence.body.id,
                description: "descriptionTest8"
            })
            
            const response = await request(app).delete(
                `/patientmovementhistory/invalidId/${patientMovement.body.description}`
            ).send()

            expect(response.status).toBe(404)
        })
    })
        

})