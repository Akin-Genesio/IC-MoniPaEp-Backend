import { Request, Response } from "express";
import { getCustomRepository, Like } from "typeorm";
import { AssignedHealthProtocol } from "../models";
import { DiseaseRepository } from "../repositories";
import { AssignedHealthProtocolRepository } from "../repositories/AssignedHealthProtocolRepository";
import { HealthProtocolRepository } from "../repositories/HealthProtocolRepository";

class AssignedHealthProtocolController {
  async create(request: Request, response: Response) {
    const body = request.body

    const assignedHealthProtocolRepository = getCustomRepository(AssignedHealthProtocolRepository)
    const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)
    const diseaseRepository = getCustomRepository(DiseaseRepository)

    const isValidDisease = await diseaseRepository.findOne({
      name: body.disease_name
    })

    if(!isValidDisease) {
      return response.status(400).json({
        error: "Doença não encontrada"
      })
    }

    const isValidHealthProtocol = await healthProtocolRepository.findOne({
      id: body.healthprotocol_id
    })
    
    if(!isValidHealthProtocol) {
      return response.status(400).json({
        error: "Protocolo de saúde não encontrado"
      })
    }

    const isAlreadyAssigned = await assignedHealthProtocolRepository.findOne({
      disease_name: body.disease_name,
      healthprotocol_id: body.healthprotocol_id
    })

    if(isAlreadyAssigned) {
      return response.status(403).json({
        error: "Este protocolo de saúde já está atribuído à essa doença"
      })
    }

    try {
      const assignedHealthProtocolBody = assignedHealthProtocolRepository.create(body)
      const assignedHealthProtocol = await assignedHealthProtocolRepository.save(assignedHealthProtocolBody)
  
      return response.status(201).json({
        success: "Protocolo de saúde atribuído à essa doença com sucesso",
        assigned_health_protocol: assignedHealthProtocol
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na atribuição do protocolo de saúde à essa doença"
      })
    }
  }

  async list(request: Request, response: Response) {
    const { disease_name, healthprotocol_id, healthprotocol_description, page } = request.query
    const take = 10
    let filters = {}

    const assignedHealthProtocolRepository = getCustomRepository(AssignedHealthProtocolRepository)

    if(disease_name) {
      filters = { ...filters, disease_name: Like(`%${String(disease_name)}%`) }
    }

    if(healthprotocol_id) {
      filters = { ...filters, healthprotocol_id: String(healthprotocol_id) }
    }

    if(healthprotocol_description) {
      const skip = page ? ((Number(page) - 1) * take) : 0 
      const limit = page ? take : 99999999
      try {
        const items = await assignedHealthProtocolRepository.createQueryBuilder("assigned_healthprotocol")
          .leftJoinAndSelect("assigned_healthprotocol.healthprotocol", "healthProtocols")
          .where("healthProtocols.description like :description", { description: `%${healthprotocol_description}%` })
          .skip(skip)
          .take(limit)
          .getManyAndCount()
        return response.status(200).json({
          assignedHealthProtocols: items[0],
          totalAssignedHealthProtocols: items[1],
        })
      } catch (error) {
        return response.status(403).json({
          error: "Erro na listagem das associações"
        })
      }
    }

    let options: any = {
      where: filters,
      relations: ["healthprotocol"]
    }

    if(page) {
      options = { ...options, take, skip: ((Number(page) - 1) * take) }
    }

    const associationList = await assignedHealthProtocolRepository.findAndCount(options)

    return response.status(200).json({
      assignedHealthProtocols: associationList[0],
      totalAssignedHealthProtocols: associationList[1],
    })
  }

  async deleteOne(request: Request, response: Response) {
    const { disease_name, healthprotocol_id } = request.params
    
    const assignedHealthProtocolRepository = getCustomRepository(AssignedHealthProtocolRepository)
    const diseaseRepository = getCustomRepository(DiseaseRepository)
    const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)

    const diseaseExists = await diseaseRepository.findOne({
      name: String(disease_name)
    })

    if(!diseaseExists) {
      return response.status(404).json({
        error: "Doença não encontrada"
      })
    }

    const healthProtocolExists = await healthProtocolRepository.findOne({
      id: String(healthprotocol_id)
    })
    
    if(!healthProtocolExists) {
      return response.status(404).json({
        error: "Protocolo de saúde não encontrado"
      })
    }

    const associationExists = await assignedHealthProtocolRepository.findOne({
      healthprotocol_id: String(healthprotocol_id),
      disease_name: String(disease_name)
    })

    if(!associationExists) {
      return response.status(404).json({
        error: "Protocolo de saúde não associado à essa doença"
      })
    }

    try {
      await assignedHealthProtocolRepository.createQueryBuilder()
        .delete()
        .from(AssignedHealthProtocol)
        .where("healthprotocol_id = :healthprotocol_id and disease_name = :disease_name", {
          healthprotocol_id, 
          disease_name
        })
        .execute()
      return response.status(200).json({
        success: "Associação deletada com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na deleção da associação"
      })
    }
  }
}

export { AssignedHealthProtocolController }