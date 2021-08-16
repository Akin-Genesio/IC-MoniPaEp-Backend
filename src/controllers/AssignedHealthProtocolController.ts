import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
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

    const IsValidDisease = await diseaseRepository.findOne({
      name: body.disease_name
    })

    if(!IsValidDisease) {
      return response.status(400).json({
        error: "Disease name not found"
      })
    }

    const healthProtocolExists = await healthProtocolRepository.findOne({
      description: body.healthprotocol_description
    })
    
    if(!healthProtocolExists) {
      return response.status(400).json({
        error: "Health protocol is not valid"
      })
    }

    const IsAlreadyAssigned = await assignedHealthProtocolRepository.findOne({
      disease_name: body.disease_name,
      healthprotocol_description: body.healthprotocol_description
    })

    if(IsAlreadyAssigned) {
      return response.status(406).json({
        error: "Protocol has already been assigned for this disease"
      })
    }

    try {
      const assignedHealthProtocol = assignedHealthProtocolRepository.create(body)
      await assignedHealthProtocolRepository.save(assignedHealthProtocol)
  
      return response.status(201).json(assignedHealthProtocol)
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }

  async list(request: Request, response: Response) {
    const {healthprotocol_description, disease_name} = request.query
    
    const assignedHealthProtocolRepository = getCustomRepository(AssignedHealthProtocolRepository)

    if(!healthprotocol_description && !disease_name) {
      const associationsList = await assignedHealthProtocolRepository.find()

      return response.status(200).json(associationsList)
    } else if(!healthprotocol_description && disease_name) {
      const diseaseRepository = getCustomRepository(DiseaseRepository)

      const diseaseExists = await diseaseRepository.findOne({
        name: String(disease_name)
      })

      if(!diseaseExists) {
        return response.status(404).json({
          error: "Disease name not found"
        })
      }

      const associationsList = await assignedHealthProtocolRepository.find({
        disease_name: String(disease_name)
      })

      return response.status(200).json(associationsList)
    } else if(healthprotocol_description && !disease_name) {
      const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)

      const healthProtocolExists = await healthProtocolRepository.findOne({
        description: String(healthprotocol_description)
      })
      
      if(!healthProtocolExists) {
        return response.status(404).json({
          error: "Health protocol is not valid"
        })
      }

      const associationsList = await assignedHealthProtocolRepository.find({
        healthprotocol_description: String(healthprotocol_description)
      })

      return response.status(200).json(associationsList)
    } else {
      const diseaseRepository = getCustomRepository(DiseaseRepository)
      const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)

      const diseaseExists = await diseaseRepository.findOne({
        name: String(disease_name)
      })

      if(!diseaseExists) {
        return response.status(404).json({
          error: "Disease name not found"
        })
      }

      const healthProtocolExists = await healthProtocolRepository.findOne({
        description: String(healthprotocol_description)
      })
      
      if(!healthProtocolExists) {
        return response.status(404).json({
          error: "Health protocol is not valid"
        })
      }

      const associationItem = await assignedHealthProtocolRepository.find({
        healthprotocol_description: String(healthprotocol_description),
        disease_name: String(disease_name)
      })

      return response.status(200).json(associationItem)
    }
  }

  async deleteOne(request: Request, response: Response) {
    const {healthprotocol_description, disease_name} = request.params
    
    const assignedHealthProtocolRepository = getCustomRepository(AssignedHealthProtocolRepository)
    const diseaseRepository = getCustomRepository(DiseaseRepository)
    const healthProtocolRepository = getCustomRepository(HealthProtocolRepository)

    const diseaseExists = await diseaseRepository.findOne({
      name: String(disease_name)
    })

    if(!diseaseExists) {
      return response.status(404).json({
        error: "Disease name not found"
      })
    }

    const healthProtocolExists = await healthProtocolRepository.findOne({
      description: String(healthprotocol_description)
    })
    
    if(!healthProtocolExists) {
      return response.status(404).json({
        error: "Health protocol is not valid"
      })
    }

    const associationExists = await assignedHealthProtocolRepository.findOne({
      healthprotocol_description: String(healthprotocol_description),
      disease_name: String(disease_name)
    })

    if(!associationExists) {
      return response.status(404).json({
        error: "Association does not exist"
      })
    }

    try {
      await assignedHealthProtocolRepository.createQueryBuilder()
        .delete()
        .from(AssignedHealthProtocol)
        .where("healthprotocol_description = :healthprotocol_description and disease_name = :disease_name", {
          healthprotocol_description: healthprotocol_description, 
          disease_name: disease_name
        })
        .execute()
      return response.status(200).json({
        message: "Association deleted!"
      })
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }
}

export { AssignedHealthProtocolController }