import request from "supertest"
import { getCustomRepository } from "typeorm"
import {app} from "../../app"

import {AssignedHealthProtocolRepository, DiseaseRepository, HealthProtocolRepository} from "../../repositories"

import createConnection from "../../database"
let connection

describe("AssignedHealthProtocol", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()
    })

    afterAll(async () => {
        await connection.dropDatabase()
    })
    
    describe("Success Cases", () => {
        it("Should assign a health protocol to a certain disease", async () => {
            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test"
            })
            
            const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)
            await request(app).post("/healthprotocol").send({
                description: "Description-Test"
            })

            const healthProtocol = await healthProtocolRepository.findOne({
                description: "Description-Test"
            })
            
            const response = await request(app).post("/assignedhealthprotocol").send({
                healthprotocol_description: `${healthProtocol.description}`,
                disease_name: `${disease.name}`
            })

            expect(response.status).toBe(201)
        })

        it("Should return a list of all assignments between health protocols assigned and diseases", async () => {
            const response = await request(app).get("/assignedhealthprotocol").send()

            expect(response.status).toBe(200)
        })
        
        it("Should return the assignments list filtered by health protocol and/or disease name", async () => {
            const diseaseRepository = getCustomRepository(DiseaseRepository)
            const createDisease = await request(app).post("/disease").send({
                name: "DiseaseName-Test2",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test2"
            })
            
            const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)
            const createdHealthProtocol = await request(app).post("/healthprotocol").send({
                description: "Description-Test2"
            })

            const healthProtocol = await healthProtocolRepository.findOne({
                description: "Description-Test2"
            })
            
            const assignedProtocol = await request(app).post("/assignedhealthprotocol").send({
                healthprotocol_description: `${healthProtocol.description}`,
                disease_name: `${disease.name}`
            })

            const response = await request(app).get(
                `/assignedhealthprotocol?healthprotocol_description=${healthProtocol.description}&disease_name=${disease.name}`
            )
            expect(response.status).toBe(200)

        })
        
        it("Should delete a specific association", async () => {
            const diseaseRepository = getCustomRepository(DiseaseRepository)
            const createDisease = await request(app).post("/disease").send({
                name: "DiseaseName-Test3",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test3"
            })

            const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)
            const createdHealthProtocol = await request(app).post("/healthprotocol").send({
                description: "Description-Test3"
            })

            const healthProtocol = await healthProtocolRepository.findOne({
                description: "Description-Test3"
            })
            
            const assignedProtocol = await request(app).post("/assignedhealthprotocol").send({
                healthprotocol_description: `${healthProtocol.description}`,
                disease_name: `${disease.name}`
            })

            const assignedHealthProtocolRepository = getCustomRepository(AssignedHealthProtocolRepository)

            const assignedProtocolTest = await assignedHealthProtocolRepository.findOne({
                healthprotocol_description: `${healthProtocol.description}`,
                disease_name: `${disease.name}`
            })

            const deletedProtocol = await request(app).delete(
                `/assignedhealthprotocol/${assignedProtocolTest.disease_name}/${assignedProtocolTest.healthprotocol_description}`)
            
            expect(deletedProtocol.status).toBe(200)


        })
        
    })
    describe("Failure Cases", () => {
        it("Should not assign a health protocol to a disease if it has already been assigned", async () => {
            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test4",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test4"
            })
            
            const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)
            await request(app).post("/healthprotocol").send({
                description: "Description-Test4"
            })

            const healthProtocol = await healthProtocolRepository.findOne({
                description: "Description-Test4"
            })
            
            const response = await request(app).post("/assignedhealthprotocol").send({
                healthprotocol_description: `${healthProtocol.description}`,
                disease_name: `${disease.name}`
            })

            const secondResponse = await request(app).post("/assignedhealthprotocol").send({
                healthprotocol_description: `${healthProtocol.description}`,
                disease_name: `${disease.name}`
            })

            expect(secondResponse.status).toBe(406)
        })

        it("Should not assign a health protocol to a disease if the health protocol specified does not exist", async () => {
            const diseaseRepository = getCustomRepository(DiseaseRepository)
            await request(app).post("/disease").send({
                name: "DiseaseName-Test5",
                infected_Monitoring_Days: 10,
                suspect_Monitoring_Days: 15
            })

            const disease = await diseaseRepository.findOne({
                name: "DiseaseName-Test5"
            })
            
            
            const response = await request(app).post("/assignedhealthprotocol").send({
                healthprotocol_description: "protocolTest-Invalid",
                disease_name: `${disease.name}`
            })

            expect(response.status).toBe(400)
        })

        it("Should not assign a health protocol to a disease if the disease specified does not exist", async () => {
            const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)
            await request(app).post("/healthprotocol").send({
                description: "Description-Test5"
            })

            const healthProtocol = await healthProtocolRepository.findOne({
                description: "Description-Test5"
            })
            
            
            const response = await request(app).post("/assignedhealthprotocol").send({
                healthprotocol_description: `${healthProtocol.description}`,
                disease_name: "diseaseTest-Invalid"
            })

            expect(response.status).toBe(400)
        })
        it("Should return error when trying to get assignments filtered by health protocol that does not exist", async () => {
            const response = await request(app).get("/assignedhealthprotocol?healthprotocol_description=FailureTest").send()

            expect(response.status).toBe(404)
        })
        it("Should return error when trying to get assignments filtered by disease that does not exist", async () => {
            const response = await request(app).get("/assignedhealthprotocol?disease_name=FailureTest").send()

            expect(response.status).toBe(404)
        })
          
        it("Should return error when trying to delete an assignment that does not exist", async () => {
    
            const deletedProtocol = await request(app).delete(
                `/assignedhealthprotocol/DiseaseName-Test1/Description-Test2`)
            
            expect(deletedProtocol.status).toBe(404)

        })

        it("Should return error when trying to delete an assignment with disease name that does not exist", async () => {
    
            const deletedProtocol = await request(app).delete(
                `/assignedhealthprotocol/DiseaseName-TestInvalid/Description-Test2`)
            
            expect(deletedProtocol.status).toBe(404)

        })

        it("Should return error when trying to delete an assignment with health protocol that does not exist", async () => {
    
            const deletedProtocol = await request(app).delete(
                `/assignedhealthprotocol/DiseaseName-Test1/Description-TestInvalid`)
            
            expect(deletedProtocol.status).toBe(404)

        })
    })
        

})