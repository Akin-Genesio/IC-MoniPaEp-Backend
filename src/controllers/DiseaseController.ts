import { Request, Response } from "express";
import { getCustomRepository, Like } from "typeorm";
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
    const { name, page } = request.query
    let filters = {}

    const diseaseRepository = getCustomRepository(DiseaseRepository)

    if(name) {
      filters = { name: Like(`%${String(name)}%`) }
    }

    let options: any = {
      where: filters,
      order: {
        name: 'ASC'
      },
    }

    if(page) {
      const take = 10
      options = { ...options, take, skip: ((Number(page) - 1) * take) }
    }

    const diseaseList = await diseaseRepository.findAndCount(options)

    return response.status(200).json({
      diseases: diseaseList[0],
      totalDiseases: diseaseList[1],
    })
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