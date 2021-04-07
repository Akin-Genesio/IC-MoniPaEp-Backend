import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { DiseaseRepository } from "../repositories";
import { HealthProtocolRepository } from "../repositories/HealthProtocolRepository"

class HealthProtocolController {
    async create(request: Request, response: Response) {
        const body = request.body
        body.disease_name = body.disease_name.trim()

        const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)
        const diseaseRepository = getCustomRepository(DiseaseRepository)

        const IsValidDisease = await diseaseRepository.findOne({
            name: body.disease_name
        })

        if(!IsValidDisease) {
            return response.status(400).json({
                error: "Disease not found!"
            })
        }
        
        const alreadyExists = await healthProtocolRepository.findOne({
            disease_name: body.disease_name
        })

        if(alreadyExists) {
            return response.status(400).json({
                error: "Health protocol has already been registered"
            })
        }

        const healthProtocol = healthProtocolRepository.create(body)
        
        await healthProtocolRepository.save(healthProtocol)

        return response.json(healthProtocol)
        
    }
}

export { HealthProtocolController }
