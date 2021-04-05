import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { HealthProtocolRepository } from "../repositories/HealthProtocolRepository";

class HealthProtocolController {
    async create(request: Request, response: Response) {
        const body = request.body
        //console.log(body)

        const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)
        
        const alreadyExists = await healthProtocolRepository.findOne({
            disease_name: body.disease_name
        })

        //console.log(alreadyExists)

        if(alreadyExists) {
            return response.status(400).json({
                error: "Health protocol already registered"
            })
        }

        const healthProtocol = healthProtocolRepository.create(body)
        
        await healthProtocolRepository.save(healthProtocol)

        return response.json(healthProtocol)
        
    }
}

export { HealthProtocolController }