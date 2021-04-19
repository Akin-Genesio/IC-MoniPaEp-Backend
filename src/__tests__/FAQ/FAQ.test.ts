import request from "supertest"
import { getCustomRepository } from "typeorm"
import {app} from "../../app"

import {FAQRepository} from "../../repositories"

import createConnection from "../../database"
let connection

describe("FAQ", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()
    })

    afterAll(async () => {
        await connection.dropDatabase()
    })
    
    describe("Success Cases", () => {
        it("Should create a new FAQ", async () => {
            const response = await request(app).post("/faq").send({
                question: "Question 1",
                answer: "Answer 1"
            })

            expect(response.status).toBe(201)
        })

        it("Should return a list of all FAQs registered", async () => {
            const response = await request(app).get("/faq").send()

            expect(response.status).toBe(200)
        })

        it("Should return a specific FAQ", async () => {
            const faqRepository = getCustomRepository(FAQRepository)

            const newFAQ = await request(app).post("/faq").send({
                question: "Question 2",
                answer: "Answer 2"
            })

            const faq = await faqRepository.findOne({question: "Question 2"})
            
            const response = await request(app).get(`/faq?question=${faq.question}`).send()

            expect(response.status).toBe(200)
        })

        it("Should alter a specific FAQ", async () => {
            const faqRepository = getCustomRepository(FAQRepository)

            const newFAQ = await request(app).post("/faq").send({
                question: "Question 2",
                answer: "Answer 2"
            })

            const faq = await faqRepository.findOne({question: "Question 2"})
            
            const response = await request(app).put(`/faq/${faq.question}`).send({
                question: "Question 2 modified",
                answer: "Answer 2"
            })

            expect(response.status).toBe(200)
        })

        it("Should delete a specific FAQ", async () => {
            const faqRepository = getCustomRepository(FAQRepository)

            const newFAQ = await request(app).post("/faq").send({
                question: "Question 2",
                answer: "Answer 2"
            })

            const faq = await faqRepository.findOne({question: "Question 2"})
            
            const response = await request(app).delete(`/faq/${faq.question}`).send()

            expect(response.status).toBe(200)
        })
    })
    describe("Failure Cases", () => {
        it("Should not create a FAQ if the question is already registered", async () => {
            const response = await request(app).post("/faq").send({
                question: "Question 1",
                answer: "Answer 1"
            })

            const secondresponse = await request(app).post("/faq").send({
                question: "Question 1",
                answer: "Answer 1"
            })

            expect(secondresponse.status).toBe(406)
        })

        it("Should return error when trying to get a FAQ that does not exist", async () => {
            const response = await request(app).get("/faq?question=FailureTest").send()

            expect(response.status).toBe(404)
        })

        it("Should return error when trying to alter a FAQ that does not exist", async () => {
            const response = await request(app).put("/faq/FailureTest").send({
                question: "questionTest",
                answer: "answerTest"
            })

            expect(response.status).toBe(404)
        })

        it("Should return error when trying to delete a FAQ that does not exist", async () => {
            const response = await request(app).delete("/faq/FailureTest").send()

            expect(response.status).toBe(404)
        })
    })
        

})