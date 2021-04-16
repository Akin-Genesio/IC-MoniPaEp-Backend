import { Request, Response } from "express";
import { getCustomRepository } from 'typeorm'
import { FAQ } from "../models";
import { FAQRepository } from "../repositories/FAQRepository";

class FAQController{
    async create(request: Request, response: Response){
        const body = request.body;
        
        const faqRepository = getCustomRepository(FAQRepository)

        const faqAlreadyExists = await faqRepository.findOne({
            question: body.question
        })

        if(faqAlreadyExists){
            return response.status(406).json({
                error: "Question has already been registered!"
            })
        }

        const faq = faqRepository.create(body)

        await faqRepository.save(faq)

        return response.status(201).json(faq);
    }

    async list(request: Request, response: Response) {
        const {question} = request.query

        const faqRepository = getCustomRepository(FAQRepository)

        if(question) {
            const questionExists = await faqRepository.findOne({
                question: String(question)
            })

            if(!questionExists) {
                return response.status(404).json({
                    error: "Question not found"
                })
            }

            return response.status(200).json(questionExists)
        } else {
            const questionsList = await faqRepository.find()
            return response.status(200).json(questionsList)
        }
    }

    async alterOne(request: Request, response: Response) {
        const body = request.body
        const {question} = request.params

        const faqRepository = getCustomRepository(FAQRepository)

        const questionExists = await faqRepository.findOne({
            question: question
        })

        if(!questionExists) {
            return response.status(404).json({
                error: "Question not found"
            })
        }

        faqRepository.createQueryBuilder()
        .update(FAQ)
        .set(body)
        .where("question = :question", {question: question})
        .execute()

        return response.status(200).json(body)
    }

    async deleteOne(request: Request, response: Response) {
        const {question} = request.params

        const faqRepository = getCustomRepository(FAQRepository)

        const questionExists = await faqRepository.findOne({
            question: question
        })

        if(!questionExists) {
            return response.status(404).json({
                error: "Question not found"
            })
        }

        faqRepository.createQueryBuilder()
        .delete()
        .from(FAQ)
        .where("question = :question", {question: question})
        .execute()

        return response.status(200).json("Question has been deleted")
    }

}

export {FAQController};