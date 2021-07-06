import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { HealthProtocol } from "../models";
import { HealthProtocolRepository } from "../repositories/HealthProtocolRepository";

class HealthProtocolController {
  async create(request: Request, response: Response) {
    const body = request.body

    const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)
    const IsAlreadyRegistered = await healthProtocolRepository.findOne({
      description: body.description
    })

    if (IsAlreadyRegistered) {
      return response.status(400).json({
        error: "Health protocol has already been registered!"
      })
    }

    try {
      const healthProtocol = healthProtocolRepository.create(body)
      await healthProtocolRepository.save(healthProtocol)

      return response.status(201).json(healthProtocol)
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }    
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

    try {
      await healthProtocolRepository.createQueryBuilder()
        .update(HealthProtocol)
        .set(body)
        .where("description = :description", { description: description })
        .execute();
      return response.status(200).json(body)
    } catch (error) {
      return response.status(403).json({
        error: "Health Protocol already registered"
      })
    }
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

    try {
      await healthProtocolRepository.createQueryBuilder()
        .delete()
        .from(HealthProtocol)
        .where("description = :description", { description: description })
        .execute();
      return response.status(200).json({
        message: "Health Protocol deleted"
      })
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }
}

export { HealthProtocolController };

