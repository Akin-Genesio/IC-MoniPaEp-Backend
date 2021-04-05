import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { DiseaseOccurrenceRepository, PatientsRepository } from "../repositories";

class DiseaseOccurrenceController {
    async create(request: Request, response: Response) {
        const body = request.body

        const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
        const patientsRepository = getCustomRepository(PatientsRepository)

        const IsValidId = await patientsRepository.findOne({
            id: body.patient_id
        })

        if(!IsValidId) {
            return response.status(400).json({
                error: "Patient id is not valid!"
            })
        }

        const diseaseOccurrence =  diseaseOccurrenceRepository.create(body)

        await diseaseOccurrenceRepository.save(diseaseOccurrence)

        return response.json(diseaseOccurrence)

    }
}

export { DiseaseOccurrenceController }