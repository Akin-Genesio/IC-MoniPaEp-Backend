import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { DiseaseRepository, HealthProtocolRepository } from "../repositories";


class HealthProtocolController{
    async create(request: Request, response: Response){
        const body = request.body

        const health_protocol_repository = getCustomRepository(HealthProtocolRepository)

        const diseaseRepository = getCustomRepository(DiseaseRepository)

        const diseaseExists = await diseaseRepository.findOne({
            name: body.disease_name
        })

        if(!diseaseExists){
            return response.status(404).json({
                error: "Invalid disease_name, disease not registered in the system"
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