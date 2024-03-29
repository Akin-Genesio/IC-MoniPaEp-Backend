import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Vaccine } from "../models";
import { PatientsRepository, USMRepository, VaccinesRepository } from "../repositories";

class VaccineController{
  async create(request: Request, response:Response){
    const body = request.body

    const vaccineRepository = getCustomRepository(VaccinesRepository)
    const patientsRepository = getCustomRepository(PatientsRepository)
    const usmRepository = getCustomRepository(USMRepository)

    const patientExists = await patientsRepository.findOne({
      id: body.patient_id
    })

    const usmExists = await usmRepository.findOne({
      name: body.usm_name
    })

    if(!usmExists){
      return response.status(404).json({
        error: "Invalid USM name"
      })
    }

    if(!patientExists){
      return response.status(404).json({
        error: "Invalid patient id"
      })
    }

    try {
      const vaccine = vaccineRepository.create(body)
      await vaccineRepository.save(vaccine)

      return response.status(201).json(vaccine)
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }

  async list(request: Request, response: Response){
    const vaccineRepository = getCustomRepository(VaccinesRepository)

    const vaccineList = await vaccineRepository.find()

    return response.json(vaccineList)
  }

  async getOne(request: Request, response: Response){
    const {vaccine_id} = request.params

    const vaccineRepository = getCustomRepository(VaccinesRepository)

    const vaccine = await vaccineRepository.findOne({
      id: vaccine_id
    })
    
    if(!vaccine){
      return response.status(404).json({
        error: "Vaccine not found"
      })
    }

    return response.status(302).json(vaccine)
  }

  async alterOne(request: Request, response: Response){
    const body = request.body
    const {vaccine_id} = request.params

    const vaccineRepository = getCustomRepository(VaccinesRepository)

    const vaccine = await vaccineRepository.findOne({
      id: vaccine_id
    })
    
    if(!vaccine){
      return response.status(404).json({
        error: "Vaccine not found"
      })
    }
    try {
      await vaccineRepository.createQueryBuilder()
        .update(Vaccine)
        .set(body)
        .where("id = :id", { id: vaccine_id })
        .execute();
      return response.status(200).json(body)
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }

  async deleteOne(request: Request, response: Response){
    const {vaccine_id} = request.params

    const vaccineRepository = getCustomRepository(VaccinesRepository)

    const vaccine = await vaccineRepository.findOne({
      id: vaccine_id
    })
    
    if(!vaccine){
      return response.status(404).json({
        error: "Vaccine not found"
      })
    }

    try {
      await vaccineRepository.createQueryBuilder()
        .delete()
        .from(Vaccine)
        .where("id = :id", { id: vaccine_id })
        .execute();
      return response.status(200).json({
        message: "Vaccine deleted"
      })
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }
}

export { VaccineController}