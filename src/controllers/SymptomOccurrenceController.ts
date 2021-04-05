import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { DiseaseOccurrenceRepository, SymptomOccurrenceRepository } from "../repositories";

class SymptomOccurrenceController {
    async create(request: Request, response: Response){
        const body = request.body

        const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)
        const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

        const IsValidDiseaseOccurrence = await diseaseOccurrenceRepository.findOne({
            id: body.disease_occurrence_id
        })

        if(!IsValidDiseaseOccurrence) {
            return response.status(400).json({
                error: "Disease occurrence id not valid!"
            })
        }

        const symptomOccurrence = symptomOccurrenceRepository.create(body)

        await symptomOccurrenceRepository.save(symptomOccurrence)

        return response.json(symptomOccurrence)
    }
}

export { SymptomOccurrenceController }