import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { USMRepository } from "../repositories";

class USMController{
    async create(request: Request, response: Response){
        const body = request.body

        const usmRepository = getCustomRepository(USMRepository)

        const usmAlreadyExists =  await usmRepository.findOne({
            name: body.name
        })

        if(usmAlreadyExists){
            return response.status(400).json({
                error: "USM already exists"
            })
        }

        const usm = usmRepository.create(body)

        await usmRepository.save(usm)

        return response.status(201).json(usm)
    }

    async list(request: Request, response: Response){
        const usmRepository = getCustomRepository(USMRepository)

        const patientsList = await usmRepository.find()

        return response.json(patientsList)
    }
}

export {USMController}