import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { PatientsRepository } from "../repositories";
import { AssignedHealthProtocolRepository } from "../repositories/AssignedHealthProtocolRepository";
import { HealthProtocolRepository } from "../repositories/HealthProtocolRepository";

class AssignedHealthProtocolController {
    async create(request: Request, response: Response) {
        const body = request.body

        const assignedHealthProtocolRepository = getCustomRepository(AssignedHealthProtocolRepository)
        const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)
        const patientsRepository = getCustomRepository(PatientsRepository)

        const patientExists = await patientsRepository.findOne({
            id: body.patient_id
        })

        if(!patientExists) {
            return response.status(400).json({
                error: "Patient not valid"
            })
        }

        const healthProtocolExists = await healthProtocolRepository.findOne({
            id: body.healthprotocol_id
        })
        
        if(!healthProtocolExists) {
            return response.status(400).json({
                error: "Health Protocol not valid"
            })
        }

        const assignedHealthProtocolAlreadyExists = await assignedHealthProtocolRepository.findOne({
            patient_id: body.patient_id,
            healthprotocol_id: body.healthprotocol_id
        })


        if(assignedHealthProtocolAlreadyExists) {
            return response.status(400).json({
                error: "Health protocol already assigned"
            })
        }

        const assignedHealthProtocol = assignedHealthProtocolRepository.create(body)
        
        await assignedHealthProtocolRepository.save(assignedHealthProtocol)

        return response.json(assignedHealthProtocol)
        
    }
}

export { AssignedHealthProtocolController }