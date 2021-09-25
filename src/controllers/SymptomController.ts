import { Request, Response } from "express";
import { getCustomRepository, Like } from "typeorm";
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
      return response.status(403).json({
        error: "Sintoma já registrado"
      })
    }

    try {
      const symptom = symptomRepository.create(body)
      await symptomRepository.save(symptom)
  
      return response.status(201).json({
        success: "Sintoma registrado com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na criação do sintoma"
      })
    }
  }

  async list(request: Request, response: Response){
    const { symptom, page } = request.query
    let filters = {}
    
    const symptomRepository = getCustomRepository(SymptomRepository)

    if(symptom) {
      filters = { symptom: Like(`%${String(symptom)}%`) }
    } 

    let options: any = {
      where: filters,
      order: {
        symptom: 'ASC'
      },
    }

    if(page) {
      const take = 10
      options = { ...options, take, skip: ((Number(page) - 1) * take) }
    }

    const symptomsList = await symptomRepository.findAndCount(options)

    return response.status(200).json({
      symptoms: symptomsList[0],
      totalSymptoms: symptomsList[1]
    })
  }

  async alterOne(request: Request, response: Response) {
    const body = request.body
    const { symptom } = request.params

    const symptomRepository = getCustomRepository(SymptomRepository)
    const isValidSymptom = await symptomRepository.findOne({ symptom })

    if(!isValidSymptom){
      return response.status(404).json({
        error: "Sintoma não encontrado"
      })
    }

    try {
      await symptomRepository.createQueryBuilder()
        .update(Symptom)
        .set(body)
        .where("symptom = :symptom", { symptom })
        .execute()
      return response.status(200).json({
        success: "Sintoma atualizado com sucesso",
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na atualização do sintoma"
      })
    }
  }

  async deleteOne(request: Request, response: Response) {
    const { symptom } = request.params

    const symptomRepository = getCustomRepository(SymptomRepository)
    const isValidSymptom = await symptomRepository.findOne({ symptom })

    if(!isValidSymptom){
      return response.status(404).json({
        error: "Sintoma não encontrado"
      })
    }

    try {
      await symptomRepository.createQueryBuilder()
        .delete()
        .from(Symptom)
        .where("symptom = :symptom", { symptom })
        .execute()
      return response.status(200).json({
        success: "Sintoma deletado com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na deleção do sintoma"
      })
    }
  }
}

export { SymptomController }