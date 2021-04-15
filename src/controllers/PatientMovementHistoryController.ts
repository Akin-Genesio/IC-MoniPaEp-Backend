import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { PatientMovementHistory } from "../models";
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

    async list(request: Request, response: Response) {
        const patientMovementRepository = getCustomRepository(PatientMovementHistoryRepository)
        
        const movementHistory = await patientMovementRepository.find()

        return response.status(200).json(movementHistory)
    }

    async getOne(request: Request, response: Response) {
        const {disease_occurrence_id} = request.params
        const {description} = request.query

        const patientMovementRepository = getCustomRepository(PatientMovementHistoryRepository)
        const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
        
        const isValidDiseaseOccurrence = await diseaseOccurrenceRepository.findOne({
            id: disease_occurrence_id
        })

        if (!isValidDiseaseOccurrence) {
            return response.status(404).json({
                error: "Disease occurrence is not valid"
            })
        }

        if(description) {
            const movementHistoryItem = await patientMovementRepository.findOne({
                disease_occurrence_id: disease_occurrence_id,
                description: String(description)
            })

            if(!movementHistoryItem) {
                return response.status(404).json({
                    error: "Movement history not found for this disease occurrence"
                })
            }
    
            return response.status(200).json(movementHistoryItem)
        }

        const movementHistoryList = await patientMovementRepository.find({
            disease_occurrence_id: disease_occurrence_id
        })

        return response.status(200).json(movementHistoryList)
    }

    async alterOne(request: Request, response: Response) {
        const body = request.body
        const {disease_occurrence_id, description} = request.params
               

        const patientMovementRepository = getCustomRepository(PatientMovementHistoryRepository)
        const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

        const isValidId = await diseaseOccurrenceRepository.findOne({
            id: disease_occurrence_id
        })

        if(!isValidId) {
            return response.status(404).json({
                error: "Disease occurrence is not valid"
            })
        }

        const isValidDescription = await patientMovementRepository.findOne({
            disease_occurrence_id: disease_occurrence_id,
            description: description
        })

        if(!isValidDescription) {
            return response.status(404).json({
                error: "Movement history not found for this disease occurrence"
            })
        }

        patientMovementRepository.createQueryBuilder()
        .update(PatientMovementHistory)
        .set(body)
        .where("disease_occurrence_id = :disease_occurrence_id and description = :description", 
            {disease_occurrence_id: disease_occurrence_id, description: description})
        .execute()

        return response.status(200).json(body)

    }

    async deleteOne(request: Request, response: Response) {
        const {disease_occurrence_id, description} = request.params
               
        const patientMovementRepository = getCustomRepository(PatientMovementHistoryRepository)
        const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

        const isValidId = await diseaseOccurrenceRepository.findOne({
            id: disease_occurrence_id
        })

        if(!isValidId) {
            return response.status(404).json({
                error: "Disease occurrence is not valid"
            })
        }

        const isValidDescription = await patientMovementRepository.findOne({
            disease_occurrence_id: disease_occurrence_id,
            description: description
        })

        if(!isValidDescription) {
            return response.status(404).json({
                error: "Movement history not found for this disease occurrence"
            })
        }

        patientMovementRepository.createQueryBuilder()
        .delete()
        .from(PatientMovementHistory)
        .where("disease_occurrence_id = :disease_occurrence_id and description = :description", 
            {disease_occurrence_id: disease_occurrence_id, description: description})
        .execute()

        return response.status(200).json("Movement history for this disease occurrence deleted!")
    }
}

export { PatientMovementHistoryController }