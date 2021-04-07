import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { DiseaseOccurrenceRepository, PatientMovementHistoryRepository } from "../repositories";

class PatientMovementHistoryController {
    async create(request: Request, response: Response) {
        const body = request.body

        const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
        const patientMovementRepository = getCustomRepository(PatientMovementHistoryRepository)

        const IsValidDiseaseOccurrence = await diseaseOccurrenceRepository.findOne({
            id: body.disease_occurrence_id
        })

        if (!IsValidDiseaseOccurrence) {
            return response.status(400).json({
                error: "Disease occurrence id is not valid!"
            })
        }

        const patientMovementHistory = patientMovementRepository.create(body)

        await patientMovementRepository.save(patientMovementHistory)

        return response.json(patientMovementHistory)
    }
}

export { PatientMovementHistoryController }