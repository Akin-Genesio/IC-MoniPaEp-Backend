import { Request, Response } from "express";
import { getCustomRepository, In, IsNull } from "typeorm";

import { Patient, SymptomOccurrence } from "../models";
import { 
  DiseaseOccurrenceRepository, 
  PatientsRepository, 
  SymptomOccurrenceRepository, 
  SymptomRepository 
} from "../repositories";
class SymptomOccurrenceController {
  async create(request: Request, response: Response){
    const body = request.body

    const patientsRepository = getCustomRepository(PatientsRepository)
    const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)
    const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
    const symptomRepository = getCustomRepository(SymptomRepository)

    const isValidPatient = await patientsRepository.findOne({
      id: body.patient_id
    })

    if(!isValidPatient) {
      return response.status(404).json({
        error: "Paciente não encontrado"
      })
    }

    if(body.symptoms.length == 0) {
      return response.status(404).json({
        error: "Selecione pelo menos um sintoma"
      })
    }
    
    

    const existOngoingDiseaseOccurrences = await diseaseOccurrenceRepository.find({
      where: {
        patient_id: body.patient_id,
        status: In(["Suspeito", "Infectado"]),
      }
    })

    body.registered_date = new Date()

    if(existOngoingDiseaseOccurrences.length === 0) {
      try {
        body.disease_occurrence_id = undefined
        const symptomOccurrence = symptomOccurrenceRepository.create(body)
        await symptomOccurrenceRepository.save(symptomOccurrence)
    
        return response.status(201).json({
          success: "Sintoma registrado com sucesso"
        })
      } catch (error) {
        return response.status(403).json({
          error: "Erro no cadastro do sintoma"
        })
      } 
    }

    else {
      for(const diseaseOccurrence of existOngoingDiseaseOccurrences) {
        try {
          body.disease_occurrence_id = diseaseOccurrence.id
          const symptomOccurrence = symptomOccurrenceRepository.create(body)
          await symptomOccurrenceRepository.save(symptomOccurrence)
        } catch (error) {
          return response.status(403).json({
            error: "Erro no cadastro do sintoma"
          })
        }
      }

      return response.status(201).json({
        success: "Sintoma registrado com sucesso"
      })
    }
  }
  async createSeveral(request: Request, response: Response){
    const body = request.body
    
    const patientsRepository = getCustomRepository(PatientsRepository)
    const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)
    const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
    const symptomRepository = getCustomRepository(SymptomRepository)

    const isValidPatient = await patientsRepository.findOne({
      id: body.patient_id
    })

    if(!isValidPatient) {
      return response.status(404).json({
        error: "Paciente não encontrado"
      })
    }
    
    const existOngoingDiseaseOccurrences = await diseaseOccurrenceRepository.find({
      where: {
        patient_id: body.patient_id,
        status: In(["Suspeito", "Infectado"]),
      }
    })

    body.registered_date = new Date()

    if(existOngoingDiseaseOccurrences.length === 0) {
    
      for(let i  in body.symptoms){
        console.log("Entrei no if: "+ body.symptoms[i])
        console.log("Entrei no if: "+ body.patient_id)
        console.log("Entrei no if: "+ body.disease_occurrence_id)
        console.log("Entrei no if: "+ body.registered_date)
      }
      
        
      body.disease_occurrence_id = undefined
      for(let i  in body.symptoms){
        try {
          const symptomOccurrence = symptomOccurrenceRepository.create({
            patient_id: body.patient_id,
            disease_occurrence_id: body.disease_occurrence_id,
            registered_date: body.registered_date,
            symptom_name: body.symptoms[i]
          })

          await symptomOccurrenceRepository.save(symptomOccurrence)

        } catch (error) {
          console.log(error)
          return response.status(403).json({
            error: "Erro no cadastro dos sintomas"
          })
        }
      }
    }

    else {
      for(const diseaseOccurrence of existOngoingDiseaseOccurrences) {
        try {
          body.disease_occurrence_id = diseaseOccurrence.id
          for(let i  in body.symptoms){
            const symptomOccurrenceBody = symptomOccurrenceRepository.create({
              ...body,
              symptom_name: body.symtoms[i]
            })
  
            await symptomOccurrenceRepository.save(symptomOccurrenceBody)
          }
        } catch (error) {
          return response.status(403).json({
            error: "Erro no cadastro dos sintomas"
          })
        }
      }
    }
    //Atualizando data de última atualização do paciente
    try {
      await patientsRepository.createQueryBuilder()
        .update(Patient)
        .set({ lastUpdate:  body.registered_date })
        .where("id = :id", { id: body.patient_id })
        .execute()
    } catch (error) {
      return response.status(404).json({
        error: "Erro na atualização do status do paciente"
      })
    }

    return response.status(201).json({
      success: "Sintomas registrado com sucesso"
    })
  }

  async getUnassignedOccurrences(request: Request, response: Response) {
    const { page, patient_name } = request.query
    const take = 10
    const skip = page ? ((Number(page) - 1) * take) : 0 

    const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)

    let whereConditions = "symptom_occurrence.disease_occurrence_id IS NULL"
    let whereParameters = {}

    if(patient_name) {
      whereConditions += " AND patients.name like :name"
      whereParameters = { name: `%${patient_name}%` }
    }
    try {
      const items = await symptomOccurrenceRepository.createQueryBuilder("symptom_occurrence")
        .addSelect("MIN(symptom_occurrence.registered_date)", "registered_date")
        .leftJoinAndSelect("symptom_occurrence.patient", "patients")
        .where(whereConditions, whereParameters)
        .groupBy("symptom_occurrence.patient_id")
        .orderBy('symptom_occurrence.registered_date', 'DESC')
        .addOrderBy('symptom_occurrence.registered_date', 'ASC')
        .getManyAndCount()
      
      const paginatedEnd = page ? Math.min(skip + take, items[0].length) : items[0].length 

      const paginatedItems = items[0].slice(skip, paginatedEnd)

      const formattedData = paginatedItems.map(occurrence => {
        return {
          ...occurrence,
          patient: {
            name: occurrence.patient.name,
            email: occurrence.patient.email
          }
        }
      })
      return response.status(200).json({
        symptomOccurrences: formattedData,
        totalSymptomOccurrences: items[0].length,
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na listagem das ocorrências de sintomas"
      })
    }
  }

  async list(request: Request, response: Response) {
    const { 
      id,
      patient_id, 
      symptom_name, 
      disease_occurrence_id,
      unassigned
    } = request.query

    const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)
    let filters = {}

    if(id) {
      filters = { ...filters, id: String(id) }

      const isValidOccurrence = await symptomOccurrenceRepository.findOne({
        id: String(id)
      })

      if(!isValidOccurrence) {
        return response.status(404).json({
          error: "Ocorrência de sintoma não encontrada"
        })
      }
    }

    if(patient_id) {
      filters = { ...filters, patient_id: String(patient_id) }

      const patientsRepository = getCustomRepository(PatientsRepository)
      const isValidPatient = await patientsRepository.findOne({
        id: String(patient_id)
      })

      if(!isValidPatient) {
        return response.status(404).json({
          error: "Paciente não encontrado"
        })
      }
    }

    if(symptom_name) {
      filters = { ...filters, symptom_name: String(symptom_name) }

      const symptomRepository = getCustomRepository(SymptomRepository)
      const isValidSymptom = await symptomRepository.findOne({
        symptom: String(symptom_name)
      })

      if(!isValidSymptom) {
        return response.status(404).json({
          error: "Sintoma não encontrado"
        })
      }
    }

    if(disease_occurrence_id) {
      filters = { ...filters, disease_occurrence_id: String(disease_occurrence_id) }

      const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
      const isValidDiseaseOccurrence = await diseaseOccurrenceRepository.findOne({
        id: String(disease_occurrence_id)
      })

      if(!isValidDiseaseOccurrence) {
        return response.status(404).json({
          error: "Ocorrência de doença não encontrada"
        })
      }
    }

    if(unassigned) {
      filters = { ...filters, disease_occurrence_id: IsNull() }
    }

    const occurrencesList = await symptomOccurrenceRepository.find({
      where: filters,
      order: {
        registered_date: 'DESC'
      }
    })

    return response.status(200).json(occurrencesList)
  }

  async alterOne(request: Request, response: Response) {
    const body = request.body
    const { id } = request.params

    const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)

    const isValidSymptomOccurrence = await symptomOccurrenceRepository.findOne({ id })

    if(!isValidSymptomOccurrence) {
      return response.status(404).json({
        error: "Ocorrência de sintoma inválida"
      })
    }

    try {
      await symptomOccurrenceRepository.createQueryBuilder()
        .update(SymptomOccurrence)
        .set(body)
        .where("id = :id", { id })
        .execute()
      return response.status(200).json({
        success: "Ocorrência de doença atualizada com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na atualização do sintoma"
      })
    }
  }

  async deleteOne(request: Request, response: Response) {
    const { id } = request.params

    const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)

    const isValidSymptomOccurrence = await symptomOccurrenceRepository.findOne({ id })

    if(!isValidSymptomOccurrence) {
      return response.status(404).json({
        error: "Ocorrência de sintoma inválida"
      })
    }

    try {
      await symptomOccurrenceRepository.createQueryBuilder()
        .delete()
        .from(SymptomOccurrence)
        .where("id = :id", { id })
        .execute()
      return response.status(200).json({
        success: "Ocorrência de doença deletada com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na deleção do sintoma"
      })
    }
  }
}

export { SymptomOccurrenceController }