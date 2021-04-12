import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { DiseaseOccurrenceRepository, DiseaseRepository, PatientsRepository } from "../repositories";

class DiseaseOccurrenceController {
    async create(request: Request, response: Response) {
        const body = request.body

        const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
        const patientsRepository = getCustomRepository(PatientsRepository)
        const diseasesRepository = getCustomRepository(DiseaseRepository)

        const patientExists = await patientsRepository.findOne({
            id: body.patient_id
        })

        if(!patientExists) {
            return response.status(400).json({
                error: "Patient id is not valid!"
            })
        }

        const diseaseExists = await diseasesRepository.findOne({
            name: body.disease_name
        })

        if(!diseaseExists) {
            return response.status(400).json({
                error: "Disease name is not valid!"
            })
        }

        const diseaseOccurrence =  diseaseOccurrenceRepository.create(body)

        await diseaseOccurrenceRepository.save(diseaseOccurrence)

        return response.json(diseaseOccurrence)

    }
}

export { DiseaseOccurrenceController }