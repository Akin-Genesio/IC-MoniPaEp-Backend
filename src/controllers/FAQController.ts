import { Request, Response } from "express";
import { getCustomRepository } from 'typeorm'
import { FAQRepository } from "../repositories/FAQRepository";

class FAQController{
    async create(request: Request, response: Response){
        const body = request.body;
        
        const faqRepository = getCustomRepository(FAQRepository)

        const FAQ = faqRepository.create(body)

        await faqRepository.save(FAQ)

        return response.json(FAQ);
    }
}

export {FAQController};