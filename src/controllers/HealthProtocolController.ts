import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { HealthProtocol } from "../models";
import { DiseaseRepository, HealthProtocolRepository } from "../repositories";


class HealthProtocolController{
    async create(request: Request, response: Response){
        const body = request.body

        const health_protocol_repository = getCustomRepository(HealthProtocolRepository)

        const healthProtocolAlreadyExists = await health_protocol_repository.findOne({
            description: body.description
        })

        if(healthProtocolAlreadyExists){
            return response.status(400).json({
                error: "Health Protocol already exists"
            })
        }

        const health_protocol = health_protocol_repository.create(body)

        await health_protocol_repository.save(health_protocol)

        return response.status(201).json(health_protocol)
    }

    async list(request: Request, response: Response){
        const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)

        const healthProtocolList = await healthProtocolRepository.find()

        return response.json(healthProtocolList)
    }

    async getOne(request: Request, response: Response){
        const {description} = request.params

        const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)

        const health_protocol = await healthProtocolRepository.findOne({
            description: description
        })
        
        if(!health_protocol){
            return response.status(404).json({
                error: "Health Protocol not found"
            })
        }

        return response.status(302).json(health_protocol)
    }

    async alterOne(request: Request, response: Response){
        const body = request.body
        const {description} = request.params

        const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)

        const health_protocol = await healthProtocolRepository.findOne({
            description: description
        })
        
        if(!health_protocol){
            return response.status(404).json({
                error: "Health Protocol not found"
            })
        }

        healthProtocolRepository.createQueryBuilder()
        .update(HealthProtocol)
        .set(body)
        .where("description = :description", { description: description })
        .execute();

        return response.status(200).json(body)
    }

    async deleteOne(request: Request, response: Response){
        const {description} = request.params

        const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)

        const health_protocol = await healthProtocolRepository.findOne({
            description: description
        })
        
        if(!health_protocol){
            return response.status(404).json({
                error: "Health Protocol not found"
            })
        }

        healthProtocolRepository.createQueryBuilder()
        .delete()
        .from(HealthProtocol)
        .where("description = :description", { description: description })
        .execute();

        return response.status(200).json("Health Protocol Deleted")
    }
}

export {HealthProtocolController}