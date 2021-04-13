import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Symptom } from "../models";
import { SymptomRepository } from "../repositories/SymptomRepository";

class SymptomController {
    async create(request: Request, response: Response) {
        const body = request.body

        const symptomRepository = getCustomRepository(SymptomRepository)

        const symptomAlreadyExists = await symptomRepository.findOne({
            symptom: body.symptom
        })

        if(symptomAlreadyExists) {
            return response.status(400).json({
                error: "Symptom has already been registered"
            })
        }

        const symptom = symptomRepository.create(body)

        await symptomRepository.save(symptom)

        return response.status(201).json(symptom)

    }

    async list(request: Request, response: Response){
        const symptomRepository = getCustomRepository(SymptomRepository)
        const symptomsList = await symptomRepository.find()

        return response.status(200).json(symptomsList)
    }

    async getOne(request: Request, response: Response) {
        const {symptom_name} = request.params

        const symptomRepository = getCustomRepository(SymptomRepository)
        const symptom = await symptomRepository.findOne({
            symptom: symptom_name
        })

        if(!symptom){
            return response.status(404).json({
                error: "Symptom not found"
            })
        }

        return response.status(302).json(symptom)
    }

    async alterOne(request: Request, response: Response) {
        const body = request.body
        const {symptom_name} = request.params

        const symptomRepository = getCustomRepository(SymptomRepository)
        const symptom = await symptomRepository.findOne({
            symptom: symptom_name
        })

        if(!symptom){
            return response.status(404).json({
                error: "Symptom not found"
            })
        }

        symptomRepository.createQueryBuilder()
        .update(Symptom)
        .set(body)
        .where("symptom = :symptom_name", {symptom_name: symptom_name})
        .execute()

        return response.status(200).json(body)
    }

    async deleteOne(request: Request, response: Response) {
        const {symptom_name} = request.params

        const symptomRepository = getCustomRepository(SymptomRepository)
        const symptom = await symptomRepository.findOne({
            symptom: symptom_name
        })

        if(!symptom){
            return response.status(404).json({
                error: "Symptom not found"
            })
        }

        symptomRepository.createQueryBuilder()
        .delete()
        .from(Symptom)
        .where("symptom = :symptom_name", {symptom_name: symptom_name})
        .execute()

        return response.status(200).json("Symptom deleted")
    }
}

export { SymptomController }