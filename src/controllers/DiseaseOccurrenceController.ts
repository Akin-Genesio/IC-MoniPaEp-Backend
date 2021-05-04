import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { DiseaseOccurrence } from "../models";
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
            return response.status(404).json({
                error: "Patient id is not valid!"
            })
        }

        const diseaseExists = await diseasesRepository.findOne({
            name: body.disease_name
        })

        if(!diseaseExists) {
            return response.status(404).json({
                error: "Disease name is not valid!"
            })
        }

        const diseaseOccurrence =  diseaseOccurrenceRepository.create(body)

        await diseaseOccurrenceRepository.save(diseaseOccurrence)

        return response.status(201).json(diseaseOccurrence)

    }

    async list (request: Request, response: Response) {
        const {patient_id} = request.query
        const {disease_name} = request.query
        
        const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
        if(!patient_id && !disease_name){
            const OccurrencesList = await diseaseOccurrenceRepository.find()
            return response.status(200).json(OccurrencesList)
        }
        else if(!patient_id && disease_name){
            const diseaseRepository = getCustomRepository(DiseaseRepository)

            const IsValidDisease = await diseaseRepository.findOne({
                name: String(disease_name)
            })

            if (!IsValidDisease){
                return response.status(404).json({
                    error: "Disease name is not valid"
                })
            }
            const OccurrencesList = await diseaseOccurrenceRepository.find({
                disease_name: String(disease_name)
            })
            return response.status(200).json(OccurrencesList)
        }
        else if(patient_id && !disease_name){
            const patientRepository = getCustomRepository(PatientsRepository)

            const IsValidPatient = await patientRepository.findOne({
                id: String(patient_id)
            })
    
            if(!IsValidPatient){
                return response.status(404).json({
                    error: "Patient id is not valid"
                })
            }
            const OccurrencesList = await diseaseOccurrenceRepository.find({
                patient_id: String(patient_id)
            })
            return response.status(200).json(OccurrencesList)
        }
        else {
            const patientRepository = getCustomRepository(PatientsRepository)
            const diseaseRepository = getCustomRepository(DiseaseRepository)

            const IsValidPatient = await patientRepository.findOne({
                id: String(patient_id)
            })
    
            if(!IsValidPatient){
                return response.status(404).json({
                    error: "Patient id is not valid"
                })
            }

            const IsValidDisease = await diseaseRepository.findOne({
                name: String(disease_name)
            })

            if (!IsValidDisease){
                return response.status(404).json({
                    error: "Disease name is not valid"
                })
            }
            const OccurrencesList = await diseaseOccurrenceRepository.find({
                patient_id: String(patient_id),
                disease_name: String(disease_name)
            })
            return response.status(200).json(OccurrencesList)
        }
        
    }

    async getOne(request: Request, response: Response) {
        const {id} = request.params
        const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
        
        const OccurrenceItem = await diseaseOccurrenceRepository.findOne({
            id: id
        })

        if(!OccurrenceItem){
            return response.status(404).json({
                error: "Disease occurrence not found"
            })
        }

        return response.status(200).json(OccurrenceItem)

    }

    async alterOne(request: Request, response: Response) {
        const body = request.body
        const {id} = request.params

        const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

        const diseaseOccurrence = await diseaseOccurrenceRepository.findOne({
            id: id
        })

        if(!diseaseOccurrence){
            return response.status(404).json({
                error: "Disease occurrence not found"
            })
        }

        diseaseOccurrenceRepository.createQueryBuilder()
        .update(DiseaseOccurrence)
        .set(body)
        .where("id = :id", {id: id})
        .execute()

        return response.status(200).json(body)
    }

    async deleteOne(request: Request, response: Response) {
        const {id} = request.params
        
        const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

        const diseaseOccurrence = await diseaseOccurrenceRepository.findOne({
            id: id
        })

        if(!diseaseOccurrence){
            return response.status(404).json({
                error: "Disease occurrence not found"
            })
        }

        diseaseOccurrenceRepository.createQueryBuilder()
        .delete()
        .from(DiseaseOccurrence)
        .where("id = :id", {id: id})
        .execute()

        return response.status(200).json("Disease Occurrence deleted!")

    }


}

export { DiseaseOccurrenceController }