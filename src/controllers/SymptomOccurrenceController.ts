import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { DiseaseOccurrenceRepository, SymptomOccurrenceRepository, SymptomRepository } from "../repositories";

class SymptomOccurrenceController {
    async create(request: Request, response: Response){
        const body = request.body
        body.symptom_name = body.symptom_name.trim()

        const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)
        const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
        const symptomRepository = getCustomRepository(SymptomRepository)

        const IsValidDiseaseOccurrence = await diseaseOccurrenceRepository.findOne({
            id: body.disease_occurrence_id
        })

        if(!IsValidDiseaseOccurrence) {
            return response.status(400).json({
                error: "Disease occurrence id not valid!"
            })
        }

        const IsValidSymptom = await symptomRepository.findOne({
            symptom: body.symptom_name
        })

        if(!IsValidSymptom) {
            return response.status(400).json({
                error: "Symptom not found!"
            })
        }

        const IsSymptomAlreadyRegistered = await symptomOccurrenceRepository.findOne({
            disease_occurrence_id: body.disease_occurrence_id,
            symptom_name: body.symptom_name
        })

        if(IsSymptomAlreadyRegistered) {
            return response.status(400).json({
                error: "Symptom has already been registered for this occurrence"
            })
        }

        const symptomOccurrence = symptomOccurrenceRepository.create(body)

        await symptomOccurrenceRepository.save(symptomOccurrence)

        return response.json(symptomOccurrence)
    }
}

export { SymptomOccurrenceController }