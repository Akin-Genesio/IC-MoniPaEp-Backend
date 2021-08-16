import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
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
      return response.status(406).json({
        error: "Symptom has already been registered"
      })
    }

    try {
      const symptom = symptomRepository.create(body)
      await symptomRepository.save(symptom)
  
      return response.status(201).json(symptom)
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }

  async list(request: Request, response: Response){
    const {symptom_name} = request.query
    
    const symptomRepository = getCustomRepository(SymptomRepository)
    
    if(!symptom_name) {
      const symptomsList = await symptomRepository.find()
      return response.status(200).json(symptomsList)
    } else {
      const symptom = await symptomRepository.findOne({
        symptom: String(symptom_name)
      })

      if(!symptom){
        return response.status(404).json({
          error: "Symptom not found"
        })
      }

      const symptomsList = await symptomRepository.find({
        symptom: String(symptom_name)
      })

      return response.status(200).json(symptomsList)
    }
  }

  async alterOne(request: Request, response: Response) {
    const body = request.body
    const {symptom_name} = request.params

    const symptomRepository = getCustomRepository(SymptomRepository)
    const symptom = await symptomRepository.findOne({
      symptom: symptom_name
    })

    if(!symptom){
      return response.status(404).json({
        error: "Symptom not found"
      })
    }

    try {
      await symptomRepository.createQueryBuilder()
        .update(Symptom)
        .set(body)
        .where("symptom = :symptom_name", {symptom_name: symptom_name})
        .execute()
      return response.status(200).json(body)
    } catch (error) {
      return response.status(403).json({
        error: "Symptom already registered"
      })
    }
  }

  async deleteOne(request: Request, response: Response) {
    const {symptom_name} = request.params

    const symptomRepository = getCustomRepository(SymptomRepository)
    const symptom = await symptomRepository.findOne({
      symptom: symptom_name
    })

    if(!symptom){
      return response.status(404).json({
        error: "Symptom not found"
      })
    }

    try {
      await symptomRepository.createQueryBuilder()
        .delete()
        .from(Symptom)
        .where("symptom = :symptom_name", {symptom_name: symptom_name})
        .execute()
      return response.status(200).json({
        message: "Symptom deleted"
      })
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }
}

export { SymptomController }