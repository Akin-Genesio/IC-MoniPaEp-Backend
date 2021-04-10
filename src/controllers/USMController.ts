import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { USM } from "../models";
import { USMRepository } from "../repositories";

class USMController{
    async create(request: Request, response: Response){
        const body = request.body

        const usmRepository = getCustomRepository(USMRepository)

        const usmAlreadyExists =  await usmRepository.findOne({
            name: body.name
        })

        if(usmAlreadyExists){
            return response.status(400).json({
                error: "USM already exists"
            })
        }

        const usm = usmRepository.create(body)

        await usmRepository.save(usm)

        return response.status(201).json(usm)
    }

    async list(request: Request, response: Response){
        const usmRepository = getCustomRepository(USMRepository)

        const usmList = await usmRepository.find()

        return response.json(usmList)
    }

    async getOne(request: Request, response: Response){
        const {usm_name} = request.params

        const usmRepository = getCustomRepository(USMRepository)


        const usm = await usmRepository.findOne({
            name: usm_name
        })
        
        if(!usm){
            return response.status(404).json({
                error: "USM not found"
            })
        }

        return response.status(302).json(usm)
    }

    async alterOne(request: Request, response: Response){
        const body = request.body
        const {usm_name} = request.params

        const usmRepository = getCustomRepository(USMRepository)

        const usm = await usmRepository.findOne({
            name: usm_name
        })
        
        if(!usm){
            return response.status(404).json({
                error: "USM not found"
            })
        }

        usmRepository.createQueryBuilder()
        .update(USM)
        .set(body)
        .where("name = :name", { name: usm_name })
        .execute();

        return response.status(200).json(body)
    }

    async deleteOne(request: Request, response: Response){
        const {usm_name} = request.params

        const usmRepository = getCustomRepository(USMRepository)

        const usm = await usmRepository.findOne({
            name: usm_name
        })
        
        if(!usm){
            return response.status(404).json({
                error: "USM not found"
            })
        }

        usmRepository.createQueryBuilder()
        .delete()
        .from(USM)
        .where("name = :name", { name: usm_name })
        .execute();

        return response.status(200).json("USM Deleted")
    }
}

export {USMController}