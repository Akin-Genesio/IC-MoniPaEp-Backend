import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { DiseaseRepository, HealthProtocolRepository } from "../repositories";


class HealthProtocolController{
    async create(request: Request, response: Response){
        const body = request.body

        const health_protocol_repository = getCustomRepository(HealthProtocolRepository)

        const healthProtocolAlreadyExists = await health_protocol_repository.findOne({
            description: body.description
        })

        if(healthProtocolAlreadyExists){
            return response.status(400).json({
                error: "Health Protocol already exists"
            })
        }

        const health_protocol = health_protocol_repository.create(body)

        await health_protocol_repository.save(health_protocol)

        return response.status(201).json(health_protocol)
    }

    async list(request: Request, response: Response){
        const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)

        const healthProtocolList = await healthProtocolRepository.find()

        return response.json(healthProtocolList)
    }
}

export {HealthProtocolController}