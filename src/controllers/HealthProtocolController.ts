import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { HealthProtocol } from "../models";
import { HealthProtocolRepository } from "../repositories/HealthProtocolRepository";

class HealthProtocolController {
  async create(request: Request, response: Response) {
    const body = request.body

    const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)
    const isAlreadyRegistered = await healthProtocolRepository.findOne({
      description: body.description
    })

    if (isAlreadyRegistered) {
      return response.status(400).json({
        error: "Protocolo de saúde já registrado"
      })
    }

    try {
      const healthProtocolBody = healthProtocolRepository.create(body)
      const healthProtocol = await healthProtocolRepository.save(healthProtocolBody)

      return response.status(201).json({
        message: "Protocolo de saúde registrado com sucesso",
        health_protocol: healthProtocol
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro no registro do protocolo de saúde"
      })
    }    
  }

  async list(request: Request, response: Response){
    const { id } = request.query
    
    const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)

    if(id) {
      const isValidHealthProtocol = await healthProtocolRepository.findOne({
        id: String(id)
      })

      if(!isValidHealthProtocol) {
        return response.status(400).json({
          error: "Protocolo de saúde inválido"
        })
      }

      return response.status(200).json(isValidHealthProtocol)
    }
    const healthProtocolList = await healthProtocolRepository.find()

    return response.status(200).json(healthProtocolList)
  }

  async alterOne(request: Request, response: Response){
    const body = request.body
    const { id } = request.params

    const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)

    const isValidHealthProtocol = await healthProtocolRepository.findOne({ id })
    
    if(!isValidHealthProtocol){
      return response.status(404).json({
        error: "Protocolo de saúde não encontrado"
      })
    }

    const isAlreadyRegistered = await healthProtocolRepository.findOne({
      description: body.description
    })

    if (isAlreadyRegistered) {
      return response.status(400).json({
        error: "Protocolo de saúde já registrado"
      })
    }

    try {
      await healthProtocolRepository.createQueryBuilder()
        .update(HealthProtocol)
        .set(body)
        .where("id = :id", { id })
        .execute();
      return response.status(200).json({
        success: "Protocolo de saúde alterado com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na atualização do protocolo de saúde"
      })
    }
  }

  async deleteOne(request: Request, response: Response){
    const { id } = request.params

    const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)

    const isValidHealthProtocol = await healthProtocolRepository.findOne({ id })
    
    if(!isValidHealthProtocol){
      return response.status(404).json({
        error: "Protocolo de saúde não encontrado"
      })
    }

    try {
      await healthProtocolRepository.createQueryBuilder()
        .delete()
        .from(HealthProtocol)
        .where("id = :id", { id })
        .execute();
      return response.status(200).json({
        success: "Protocolo de saúde deletado com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na deleção do protocolo de saúde"
      })
    }
  }
}

export { HealthProtocolController };

