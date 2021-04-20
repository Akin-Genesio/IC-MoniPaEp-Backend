import request from "supertest"
import { getCustomRepository } from "typeorm"
import {app} from "../../app"

import {SymptomOccurrenceRepository, SymptomRepository, DiseaseOccurrenceRepository, PatientsRepository, DiseaseRepository} from "../../repositories"

import createConnection from "../../database"
let connection

describe("SymptomOccurrence", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()
    })

    afterAll(async () => {
        await connection.dropDatabase()
    })
    
    describe("Success Cases", () => {
        it("Should link a symptom to a disease occurrence specified", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)
            await request(app).post("/symptom").send({
                symptom: "Symptom-1"
            })

            const symptom = await symptomRepository.findOne({
                symptom: "Symptom-1"
            })

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
            
            const postDiseaseOccurrence = await request(app).post("/diseaseoccurrence").send({
                disease_name: `${disease.name}`,
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })

            const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

            const diseaseTest = await diseaseOccurrenceRepository.findOne({
                id: postDiseaseOccurrence.body.id
            })

            const response = await request(app).post("/symptomoccurrence").send({
                disease_occurrence_id: diseaseTest.id,
                symptom_name: symptom.symptom,
                registered_date: "19-04-2021"
            })

            
            expect(response.status).toBe(201)
        })

        it("Should return all symptom occurrences registered", async () => {
            const response = await request(app).get("/symptomoccurrence").send()

            expect(response.status).toBe(200)
        })
        
        it("Should return the symptom occurrences filtered by a specific disease occurrence and/or symptom", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)
            await request(app).post("/symptom").send({
                symptom: "Symptom-2"
            })

            const symptom = await symptomRepository.findOne({
                symptom: "Symptom-2"
            })

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

            const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

            const diseaseTest = await diseaseOccurrenceRepository.findOne({
                id: postDiseaseOccurrence.body.id
            })

            const response = await request(app).post("/symptomoccurrence").send({
                disease_occurrence_id: diseaseTest.id,
                symptom_name: symptom.symptom,
                registered_date: "19-04-2021"
            })
            
            const responseTest = await request(app).get(
                `/symptomoccurrence?symptom_name=${symptom.symptom}&disease_occurrence_id=${diseaseTest.id}`
            ).send()

            expect(responseTest.status).toBe(200)
            
        })

        it("Should alter a symptom occurrence specified by the symptom and disease occurrence id", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)
            await request(app).post("/symptom").send({
                symptom: "Symptom-3"
            })

            const symptom = await symptomRepository.findOne({
                symptom: "Symptom-3"
            })

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

            const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

            const diseaseTest = await diseaseOccurrenceRepository.findOne({
                id: postDiseaseOccurrence.body.id
            })

            const response = await request(app).post("/symptomoccurrence").send({
                disease_occurrence_id: diseaseTest.id,
                symptom_name: symptom.symptom,
                registered_date: "19-04-2021"
            })
            
            const responseTest = await request(app).put(
                `/symptomoccurrence/${diseaseTest.id}/${symptom.symptom}`
            ).send({
                registered_date: "20-04-2021"
            })

            expect(responseTest.status).toBe(200)

        })
        
        it("Should delete a symptom occurrence specified by the symptom and disease occurrence id", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)
            await request(app).post("/symptom").send({
                symptom: "Symptom-4"
            })

            const symptom = await symptomRepository.findOne({
                symptom: "Symptom-4"
            })

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

            const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

            const diseaseTest = await diseaseOccurrenceRepository.findOne({
                id: postDiseaseOccurrence.body.id
            })

            const response = await request(app).post("/symptomoccurrence").send({
                disease_occurrence_id: diseaseTest.id,
                symptom_name: symptom.symptom,
                registered_date: "19-04-2021"
            })
            
            const responseTest = await request(app).delete(
                `/symptomoccurrence/${diseaseTest.id}/${symptom.symptom}`
            ).send()

            expect(responseTest.status).toBe(200)

        })
        
    })
    describe("Failure Cases", () => {
        it("Should not link a symptom to a disease occurrence if it has already been linked", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)
            await request(app).post("/symptom").send({
                symptom: "Symptom-5"
            })

            const symptom = await symptomRepository.findOne({
                symptom: "Symptom-5"
            })

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

            const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

            const diseaseTest = await diseaseOccurrenceRepository.findOne({
                id: postDiseaseOccurrence.body.id
            })

            const response = await request(app).post("/symptomoccurrence").send({
                disease_occurrence_id: diseaseTest.id,
                symptom_name: symptom.symptom,
                registered_date: "19-04-2021"
            })

            const secondResponse = await request(app).post("/symptomoccurrence").send({
                disease_occurrence_id: diseaseTest.id,
                symptom_name: symptom.symptom,
                registered_date: "19-04-2021"
            })

            
            expect(secondResponse.status).toBe(406)
        })

        it("Should not link a symptom to a disease occurrence if the symptom does not exist", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)
            await request(app).post("/symptom").send({
                symptom: "Symptom-6"
            })

            const symptom = await symptomRepository.findOne({
                symptom: "Symptom-6"
            })

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
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })

            const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

            const diseaseTest = await diseaseOccurrenceRepository.findOne({
                id: postDiseaseOccurrence.body.id
            })

            const response = await request(app).post("/symptomoccurrence").send({
                disease_occurrence_id: diseaseTest.id,
                symptom_name: "Symptom-Invalid",
                registered_date: "19-04-2021"
            })

            expect(response.status).toBe(404)
        })

        it("Should not link a symptom to a disease occurrence if the disease occurrence does not exist", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)
            await request(app).post("/symptom").send({
                symptom: "Symptom-7"
            })

            const symptom = await symptomRepository.findOne({
                symptom: "Symptom-7"
            })

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
                disease_name: `${disease.name}`,
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })

            const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

            const diseaseTest = await diseaseOccurrenceRepository.findOne({
                id: postDiseaseOccurrence.body.id
            })

            const response = await request(app).post("/symptomoccurrence").send({
                disease_occurrence_id: "diseaseIdInvalid",
                symptom_name: symptom.symptom,
                registered_date: "19-04-2021"
            })

            expect(response.status).toBe(404)
        })

        
        it("Should return error when trying to get symptom occurrences filtered by symptom that does not exist", async () => {
            const response = await request(app).get("/symptomoccurrence?symptom_name=FailureTest").send()

            expect(response.status).toBe(404)
        })

        it("Should return error when trying to get symptom occurrences filtered by disease occurrence that does not exist", async () => {
            const response = await request(app).get("/symptomoccurrence?disease_occurrence_id=FailureTest").send()

            expect(response.status).toBe(404)
        })
        
        it("Should return error when trying to alter a symptom occurrence that does not exist", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)
            await request(app).post("/symptom").send({
                symptom: "Symptom-8"
            })

            const symptom = await symptomRepository.findOne({
                symptom: "Symptom-8"
            })

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

            const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

            const diseaseTest = await diseaseOccurrenceRepository.findOne({
                id: postDiseaseOccurrence.body.id
            })

            const response = await request(app).post("/symptomoccurrence").send({
                disease_occurrence_id: diseaseTest.id,
                symptom_name: symptom.symptom,
                registered_date: "19-04-2021"
            })

            const secondResponse = await request(app).put(
                `/symptomoccurrence/${diseaseTest.id}/Symptom-7`
            )

            expect(secondResponse.status).toBe(404)
            

        })
        
        it("Should return error when trying to alter a symptom occurrence with a symptom name that does not exist", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)
            await request(app).post("/symptom").send({
                symptom: "Symptom-9"
            })

            const symptom = await symptomRepository.findOne({
                symptom: "Symptom-9"
            })

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

            const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

            const diseaseTest = await diseaseOccurrenceRepository.findOne({
                id: postDiseaseOccurrence.body.id
            })

            const response = await request(app).post("/symptomoccurrence").send({
                disease_occurrence_id: diseaseTest.id,
                symptom_name: symptom.symptom,
                registered_date: "19-04-2021"
            })

            const secondResponse = await request(app).put(
                `/symptomoccurrence/${diseaseTest.id}/InvalidSymptom`
            )

            expect(secondResponse.status).toBe(404)

        })

        it("Should return error when trying to alter a symptom occurrence with a disease occurrence that does not exist", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)
            await request(app).post("/symptom").send({
                symptom: "Symptom-10"
            })

            const symptom = await symptomRepository.findOne({
                symptom: "Symptom-10"
            })

            const patientsRepository = getCustomRepository(PatientsRepository)
            const patientpost = await request(app).post("/patients").send({
                name: "Test",
                email: "test10@email.com",
                password: "123456789",
                lastGPSLocation: "123",
                allowSMS: true,
                workAddress: "321",
                homeAddress: "213",
                hasHealthPlan: false ,
                age: 23,
                status: "saudavel"
            })

            const patient = await patientsRepository.findOne({email: "test10@email.com"})

            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test10",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test10"
            })
            
            const postDiseaseOccurrence = await request(app).post("/diseaseoccurrence").send({
                disease_name: `${disease.name}`,
                patient_id: `${patient.id}`,
                diagnosis: "diagnosis",
                status: "status",
                date_start: "19-04-2021"
            })

            const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

            const diseaseTest = await diseaseOccurrenceRepository.findOne({
                id: postDiseaseOccurrence.body.id
            })

            const response = await request(app).post("/symptomoccurrence").send({
                disease_occurrence_id: diseaseTest.id,
                symptom_name: symptom.symptom,
                registered_date: "19-04-2021"
            })

            const secondResponse = await request(app).put(
                `/symptomoccurrence/invalidDiseaseId/${symptom.symptom}`
            )

            expect(secondResponse.status).toBe(404)

        })
        
        it("Should return error when trying to delete a symptom occurrence that does not exist", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)
            await request(app).post("/symptom").send({
                symptom: "Symptom-11"
            })

            const symptom = await symptomRepository.findOne({
                symptom: "Symptom-11"
            })

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

            const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

            const diseaseTest = await diseaseOccurrenceRepository.findOne({
                id: postDiseaseOccurrence.body.id
            })

            const response = await request(app).post("/symptomoccurrence").send({
                disease_occurrence_id: diseaseTest.id,
                symptom_name: symptom.symptom,
                registered_date: "19-04-2021"
            })


            const deletedProtocol = await request(app).delete(
                `/symptomoccurrence/${diseaseTest.id}/Symptom-1`
            )
            
            expect(deletedProtocol.status).toBe(404)

        })

        it("Should return error when trying to delete a symptom occurrence with a symptom name that does not exist", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)
            await request(app).post("/symptom").send({
                symptom: "Symptom-12"
            })

            const symptom = await symptomRepository.findOne({
                symptom: "Symptom-12"
            })

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

            const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

            const diseaseTest = await diseaseOccurrenceRepository.findOne({
                id: postDiseaseOccurrence.body.id
            })

            const response = await request(app).post("/symptomoccurrence").send({
                disease_occurrence_id: diseaseTest.id,
                symptom_name: symptom.symptom,
                registered_date: "19-04-2021"
            })


            const deletedProtocol = await request(app).delete(
                `/symptomoccurrence/${diseaseTest.id}/Symptom-Invalid`
            )
            
            expect(deletedProtocol.status).toBe(404)

        })

        it("Should return error when trying to delete a symptom occurrence with a disease occurrence that does not exist", async () => {
            const symptomRepository = getCustomRepository(SymptomRepository)
            await request(app).post("/symptom").send({
                symptom: "Symptom-13"
            })

            const symptom = await symptomRepository.findOne({
                symptom: "Symptom-13"
            })

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

            const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

            const diseaseTest = await diseaseOccurrenceRepository.findOne({
                id: postDiseaseOccurrence.body.id
            })

            const response = await request(app).post("/symptomoccurrence").send({
                disease_occurrence_id: diseaseTest.id,
                symptom_name: symptom.symptom,
                registered_date: "19-04-2021"
            })


            const deletedProtocol = await request(app).delete(
                `/symptomoccurrence/invalidDiseaseOccurenceId/${symptom.symptom}`
            )
            
            expect(deletedProtocol.status).toBe(404)

        })
    })
        

})