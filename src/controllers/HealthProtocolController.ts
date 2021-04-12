import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { HealthProtocolRepository } from "../repositories/HealthProtocolRepository";

class HealthProtocolController {
    async create(request: Request, response: Response) {
        const body = request.body
        //body.disease_name = body.disease_name.trim()

        const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)

        const healthProtocol = healthProtocolRepository.create(body)
        
        await healthProtocolRepository.save(healthProtocol)

        return response.json(healthProtocol)
        
    }
}

export { HealthProtocolController };

