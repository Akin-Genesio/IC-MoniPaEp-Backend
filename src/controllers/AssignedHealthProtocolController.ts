import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { DiseaseRepository, PatientsRepository } from "../repositories";
import { AssignedHealthProtocolRepository } from "../repositories/AssignedHealthProtocolRepository";
import { HealthProtocolRepository } from "../repositories/HealthProtocolRepository";

class AssignedHealthProtocolController {
    async create(request: Request, response: Response) {
        const body = request.body

        const assignedHealthProtocolRepository = getCustomRepository(AssignedHealthProtocolRepository)
        const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)


        const healthProtocolExists = await healthProtocolRepository.findOne({
            description: body.healthprotocol_description
        })
        
        if(!healthProtocolExists) {
            return response.status(400).json({
                error: "Health protocol is not valid"
            })
        }

        const assignedHealthProtocol = assignedHealthProtocolRepository.create(body)
        
        await assignedHealthProtocolRepository.save(assignedHealthProtocol)

        return response.json(assignedHealthProtocol)
        
    }
}

export { AssignedHealthProtocolController }