import { Request, Response } from "express";
import { getCustomRepository, IsNull } from "typeorm";

import { DiseaseOccurrence, Patient, SymptomOccurrence } from "../models";
import { 
  DiseaseOccurrenceRepository, 
  DiseaseRepository, 
  PatientsRepository, 
  SymptomOccurrenceRepository 
} from "../repositories";

class DiseaseOccurrenceController {
  async create(request: Request, response: Response) {
    const body = request.body

    const patientsRepository = getCustomRepository(PatientsRepository)
    const diseasesRepository = getCustomRepository(DiseaseRepository)
    const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)
    const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

    const patientExists = await patientsRepository.findOne({
      id: body.patient_id
    })

    if(!patientExists) {
      return response.status(404).json({
        error: "Paciente inválido"
      })
    }

    let createdDiseaseOccurrences = []

    for (let i in body.disease_name) {
      const validDisease = await diseasesRepository.findOne({
        name: body.disease_name[i]
      })

      if(!validDisease) {
        return response.status(403).json({
          error: `A doença '${body.disease_name[i]}' não se encontra cadastrada no sistema`
        })
      }

      const diseaseOccurrenceBody = diseaseOccurrenceRepository.create({
        ...body,
        disease_name: body.disease_name[i]
      })

      const diseaseOccurrence = await diseaseOccurrenceRepository.save(diseaseOccurrenceBody)
      createdDiseaseOccurrences.push(diseaseOccurrence)
      //console.log(diseaseOccurrence)
    }

    const numberOfDiseaseOccurrences = createdDiseaseOccurrences.length

    const notAssignedSymptomOccurrences = await symptomOccurrenceRepository.find({
      patient_id: body.patient_id,
      disease_occurrence_id: IsNull()
    })

    for(const symptomOccurrence of notAssignedSymptomOccurrences) {
      try {
        await symptomOccurrenceRepository.createQueryBuilder()
        .update(SymptomOccurrence)
          .set({
            disease_occurrence_id: createdDiseaseOccurrences[0].id
          })
          .where("id = :id", { id: symptomOccurrence.id })
          .execute()
      } catch (error) {
        return response.status(403).json({
          error: "Erro na atualização do sintoma"
        })
      }
    }
      
    if(numberOfDiseaseOccurrences > 1) {
      for(let i = 1; i < numberOfDiseaseOccurrences; i++) {
        for(const symptomOccurrence of notAssignedSymptomOccurrences) {
          try {
            const symptomOccurrenceBody = symptomOccurrenceRepository.create({
              patient_id: symptomOccurrence.patient_id,
              symptom_name: symptomOccurrence.symptom_name,
              registered_date: symptomOccurrence.registered_date,
              disease_occurrence_id: createdDiseaseOccurrences[i].id
            })
            await symptomOccurrenceRepository.save(symptomOccurrenceBody)
          } catch (error) {
            return response.status(403).json({
              error: "Erro na atualização do sintoma."
            })
          }
        }
      }
    } 
    
    return response.status(201).json(createdDiseaseOccurrences)
  }

  async list (request: Request, response: Response) {
    const {
      id,
      patient_id,
      disease_name,
      status
    } = request.query

    let filters = {}

    if(id) {
      filters = { ...filters, id: String(id) }
    }

    if(patient_id) {
      filters = { ...filters, patient_id: String(patient_id) }
    }

    if(disease_name) {
      filters = { ...filters, disease_name: String(disease_name) }
    }

    if(status) {
      filters = { ...filters, disease_occurrence_id: String(status) }
    }

    const hasQueryParams = Object.keys(filters).length
    
    const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
    const patientRepository = getCustomRepository(PatientsRepository)
    const diseaseRepository = getCustomRepository(DiseaseRepository)

    if(!hasQueryParams) {
      const diseaseOccurrences = await diseaseOccurrenceRepository.find()
  
      return response.status(200).json(diseaseOccurrences)
    } else {
      if(id) {
        const isValidDiseaseOccurrence = await diseaseOccurrenceRepository.find({
          id: String(id)
        })
  
        if(!isValidDiseaseOccurrence){
          return response.status(404).json({
            error: "Ocorrência de doença não encontrada"
          })
        }
      }
  
      if(patient_id) {
        const isValidPatient = await patientRepository.findOne({
          id: String(patient_id)
        })
    
        if(!isValidPatient){
          return response.status(404).json({
            error: "Paciente não encontrado"
          })
        }
      }
  
      if(disease_name) {
        const isValidDisease = await diseaseRepository.findOne({
          name: String(disease_name)
        })
    
        if (!isValidDisease){
          return response.status(404).json({
            error: "Doença não encontrada"
          })
        }
      }
  
      const diseaseOccurrences = await diseaseOccurrenceRepository.find(filters)
  
      return response.status(200).json(diseaseOccurrences)
    }
  }

  async alterOne(request: Request, response: Response) {
    const body = request.body
    const { id } = request.params

    const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
    const diseaseRepository = getCustomRepository(DiseaseRepository)
    const patientsRepository = getCustomRepository(PatientsRepository)

    const diseaseOccurrence = await diseaseOccurrenceRepository.findOne({ id })

    if(!diseaseOccurrence){
      return response.status(404).json({
        error: "Ocorrência de doença não encontrada"
      })
    }

    if(body.disease_name) {
      const diseaseName = await diseaseRepository.findOne({
        name: body.disease_name
      })
  
      if(!diseaseName){
        return response.status(404).json({
          error: "Doença não encontrada"
        })
      }
    }

    if(body.patient_id) {
      const patient = await patientsRepository.find({
        id: body.patient_id
      })

      if(!patient){
        return response.status(404).json({
          error: "Paciente não encontrado"
        })
      }
    }

    try {
      await diseaseOccurrenceRepository.createQueryBuilder()
        .update(DiseaseOccurrence)
        .set(body)
        .where("id = :id", { id })
        .execute()
      return response.status(200).json({
        message: "Ocorrência de doença atualizada"
      })
    } catch (error) {
      return response.status(404).json({
        error: "Erro na atualização da ocorrência de doença"
      })
    }
  }

  async deleteOne(request: Request, response: Response) {
    const { id } = request.params
    
    const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

    const diseaseOccurrence = await diseaseOccurrenceRepository.findOne({ id })

    if(!diseaseOccurrence){
      return response.status(404).json({
        error: "Ocorrência de doença não encontrada"
      })
    }

    try {
      await diseaseOccurrenceRepository.createQueryBuilder()
        .delete()
        .from(DiseaseOccurrence)
        .where("id = :id", { id })
        .execute()
      return response.status(200).json({
        message: "Ocorrência de doença deletada"
      })
    } catch (error) {
      return response.status(404).json({
        error: "Erro na deleção da ocorrência de doença"
      })
    }
  }
}

export { DiseaseOccurrenceController }