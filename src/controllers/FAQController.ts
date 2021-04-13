import { Request, Response } from "express";
import { getCustomRepository } from 'typeorm'
import { FAQRepository } from "../repositories/FAQRepository";

class FAQController{
    async create(request: Request, response: Response){
        const body = request.body;
        
        const faqRepository = getCustomRepository(FAQRepository)

        const FaqAlreadyExists = faqRepository.findOne({
            question: body.question
        })

        if(FaqAlreadyExists){
            return response.status(400).json({
                error: "Question already registered!"
            })
        }

        const FAQ = faqRepository.create(body)

        await faqRepository.save(FAQ)

        return response.json(FAQ);
    }
}

export {FAQController};