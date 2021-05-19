import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Disease } from "../models";
import { DiseaseRepository } from "../repositories";

class DiseaseController{
    async create(request: Request, response: Response){
        const body = request.body

        const diseaseRepository = getCustomRepository(DiseaseRepository)

        const diseaseAlreadyExists = await diseaseRepository.findOne({
            name: body.name
        })

        //console.log('resultado = '+ diseaseAlreadyExists)
        if(diseaseAlreadyExists){
            return response.status(400).json({
                error: "This disease is already registered in the system"
            })
        }
        const disease = diseaseRepository.create(body)

        await diseaseRepository.save(disease)

        return response.status(201).json(disease)
    }

    async list(request: Request, response: Response){
        const diseaseRepository = getCustomRepository(DiseaseRepository)

        const diseaseList = await diseaseRepository.find()

        return response.status(200).json(diseaseList)
    }

    async getOne(request: Request, response: Response){
        const {disease_name} = request.params

        const diseaseRepository = getCustomRepository(DiseaseRepository)


        const disease = await diseaseRepository.findOne({
            name: disease_name
        })
        
        if(!disease){
            return response.status(404).json({
                error: "Disease not found"
            })
        }

        return response.status(302).json(disease)
    }

    async alterOne(request: Request, response: Response){
        const body = request.body
        const {disease_name} = request.params

        const diseaseRepository = getCustomRepository(DiseaseRepository)


        const disease = await diseaseRepository.findOne({
            name: disease_name
        })
        
        if(!disease){
            return response.status(404).json({
                error: "Disease not found"
            })
        }

        try {
            let query = await diseaseRepository.createQueryBuilder()
                .update(Disease)
                .set(body)
                .where("name = :name", { name: disease_name })
                .execute();
        } catch (error) {
            return response.status(403).json({
                error: "Disease name is already registered"
            })
        }
        
        return response.status(200).json(body)
    }

    async deleteOne(request: Request, response: Response){
        const {disease_name} = request.params

        const diseaseRepository = getCustomRepository(DiseaseRepository)


        const disease = await diseaseRepository.findOne({
            name: disease_name
        })
        
        if(!disease){
            return response.status(404).json({
                error: "Disease not found"
            })
        }
        
        try {
            let query = await diseaseRepository.createQueryBuilder()
                .delete()
                .from(Disease)
                .where("name = :name", { name: disease_name })
                .execute();
        } catch (error) {
            return response.status(403).json({
                error: error
            })
        }
        
        return response.status(200).json("Disease Deleted")
    }
}

export{DiseaseController}