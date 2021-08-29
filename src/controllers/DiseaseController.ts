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

    if(diseaseAlreadyExists){
      return response.status(403).json({
        error: "Doença já registrada"
      })
    }
    
    try {
      const disease = diseaseRepository.create(body)
      await diseaseRepository.save(disease)

      return response.status(201).json({
        success: "Doença registrada com sucesso"
      })
    } catch (error) {
      return response.status(400).json({
        error: "Erro no registro da doença"
      })
    }
  }

  async list(request: Request, response: Response){
    const { name } = request.query

    const diseaseRepository = getCustomRepository(DiseaseRepository)

    if(!name) {
      const diseaseList = await diseaseRepository.find()

      return response.status(200).json(diseaseList)
    } else {
      const isValidDisease = await diseaseRepository.findOne({
        name: String(name)
      })

      if(!isValidDisease){
        return response.status(404).json({
          error: "Doença não encontrada"
        })
      }

      return response.status(200).json(isValidDisease)
    }
  }

  async alterOne(request: Request, response: Response){
    const body = request.body
    const { name } = request.params

    const diseaseRepository = getCustomRepository(DiseaseRepository)

    const isValidDisease = await diseaseRepository.findOne({ name })
    
    if(!isValidDisease){
      return response.status(404).json({
        error: "Doença não encontrada"
      })
    }

    try {
      await diseaseRepository.createQueryBuilder()
        .update(Disease)
        .set(body)
        .where("name = :name", { name })
        .execute();
      return response.status(200).json({
        success: "Doença atualizada com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na atualização da doença"
      })
    }
  }

  async deleteOne(request: Request, response: Response){
    const { name } = request.params

    const diseaseRepository = getCustomRepository(DiseaseRepository)

    const isValidDisease = await diseaseRepository.findOne({ name })
    
    if(!isValidDisease){
      return response.status(404).json({
        error: "Doença não encontrada"
      })
    }
    
    try {
      await diseaseRepository.createQueryBuilder()
        .delete()
        .from(Disease)
        .where("name = :name", { name })
        .execute();
      return response.status(200).json({
        success: "Doença deletada com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na deleção da doença"
      })
    }
  }
}

export { DiseaseController }