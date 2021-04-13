import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { DiseaseRepository } from "../repositories";
import { AssignedHealthProtocolRepository } from "../repositories/AssignedHealthProtocolRepository";
import { HealthProtocolRepository } from "../repositories/HealthProtocolRepository";

class AssignedHealthProtocolController {
    async create(request: Request, response: Response) {
        const body = request.body

        const assignedHealthProtocolRepository = getCustomRepository(AssignedHealthProtocolRepository)
        const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)
        const diseaseRepository = getCustomRepository(DiseaseRepository)

        const IsValidDisease = await diseaseRepository.findOne({
            name: body.disease_name
        })

        if(!IsValidDisease) {
            return response.status(400).json({
                error: "Disease name not found"
            })
        }

        const healthProtocolExists = await healthProtocolRepository.findOne({
            description: body.healthprotocol_description
        })
        
        if(!healthProtocolExists) {
            return response.status(400).json({
                error: "Health protocol is not valid"
            })
        }

        const IsAlreadyAssigned = await assignedHealthProtocolRepository.findOne({
            disease_name: body.disease_name,
            healthprotocol_description: body.healthprotocol_description
        })

        if(IsAlreadyAssigned) {
            return response.status(400).json({
                error: "Protocol has already been assigned for this disease"
            })
        }

        const assignedHealthProtocol = assignedHealthProtocolRepository.create(body)
        
        await assignedHealthProtocolRepository.save(assignedHealthProtocol)

        return response.json(assignedHealthProtocol)
        
    }
}

export { AssignedHealthProtocolController }