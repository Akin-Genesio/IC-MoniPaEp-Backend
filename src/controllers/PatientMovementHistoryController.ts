import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { PatientMovementHistory } from "../models";
import { DiseaseOccurrenceRepository, PatientMovementHistoryRepository } from "../repositories";
class PatientMovementHistoryController {
  async create(request: Request, response: Response) {
    const body = request.body

    const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
    const patientMovementRepository = getCustomRepository(PatientMovementHistoryRepository)

    const isValidDiseaseOccurrence = await diseaseOccurrenceRepository.findOne({
      id: body.disease_occurrence_id
    })

    if (!isValidDiseaseOccurrence) {
      return response.status(404).json({
        error: "Ocorrência de doença não encontrada"
      })
    }

    try {
      const patientMovementHistoryBody = patientMovementRepository.create(body)
      const patientMovementHistory = await patientMovementRepository.save(patientMovementHistoryBody)
  
      return response.status(201).json({
        success: "Histórico de movimentação registrado com sucesso",
        patientMovementHistory
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro no registro do histórico de movimentação"
      })
    }
  }

  async list(request: Request, response: Response) {
    const { disease_occurrence_id, id } = request.query

    const patientMovementRepository = getCustomRepository(PatientMovementHistoryRepository)
    let filters = {}

    if(id) {
      filters = { ...filters, id: String(id) }

      const isValidPatientMovementHistory = await patientMovementRepository.findOne({
        id: String(id)
      })

      if (!isValidPatientMovementHistory) {
        return response.status(404).json({
          error: "Histórico de movimentação não encontrado"
        })
      }
    }

    if(disease_occurrence_id) {
      filters = { ...filters, disease_occurrence_id: String(disease_occurrence_id) }

      const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
      const isValidDiseaseOccurrence = await diseaseOccurrenceRepository.findOne({
        id: String(disease_occurrence_id)
      })
  
      if (!isValidDiseaseOccurrence) {
        return response.status(404).json({
          error: "Ocorrência de doença não encontrada"
        })
      }
    }
    const movementHistoryItems = await patientMovementRepository.find(filters)

    return response.status(200).json(movementHistoryItems)
  }

  async alterOne(request: Request, response: Response) {
    const body = request.body
    const { id } = request.params
            
    const patientMovementRepository = getCustomRepository(PatientMovementHistoryRepository)

    const isValidMovement = await patientMovementRepository.findOne({ id })

    if(!isValidMovement) {
      return response.status(404).json({
        error: "Histórico de movimentação não encontrado"
      })
    }

    try {
      await patientMovementRepository.createQueryBuilder()
        .update(PatientMovementHistory)
        .set(body)
        .where("id = :id", { id })
        .execute()
      return response.status(200).json({
        success: "Histórico de movimentação alterado com sucesso",
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na atualização do histórico de movimentação"
      })
    }
  }

  async deleteOne(request: Request, response: Response) {
    const { id } = request.params
            
    const patientMovementRepository = getCustomRepository(PatientMovementHistoryRepository)

    const isValidMovement = await patientMovementRepository.findOne({ id })

    if(!isValidMovement) {
      return response.status(404).json({
        error: "Histórico de movimentação não encontrado"
      })
    }

    try {
      await patientMovementRepository.createQueryBuilder()
        .delete()
        .from(PatientMovementHistory)
        .where("id = :id", { id })
        .execute()
      return response.status(200).json({
        success: "Histórico de movimentação deletado com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na deleção do histórico de movimentação"
      })
    }
  }
}

export { PatientMovementHistoryController }