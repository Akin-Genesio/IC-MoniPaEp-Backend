import { Request, Response } from "express";
import { getCustomRepository, In } from "typeorm";
import { SymptomOccurrence } from "../models";
import { 
  DiseaseOccurrenceRepository, 
  PatientsRepository, 
  SymptomOccurrenceRepository, 
  SymptomRepository 
} from "../repositories";
class SymptomOccurrenceController {
  async create(request: Request, response: Response){
    const body = request.body

    try {
      body.symptom_name = body.symptom_name.trim()
    } catch (error) {
      return response.status(403).json({
        error: "Sintoma não digitado"
      })
    }

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
    
    const isValidSymptom = await symptomRepository.findOne({
      symptom: body.symptom_name
    })

    if(!isValidSymptom) {
      return response.status(404).json({
        error: "Sintoma não encontrado"
      })
    }

    const existOngoingDiseaseOccurrences = await diseaseOccurrenceRepository.find({
      where: {
        patient_id: body.patient_id,
        status: In(["Suspeito", "Infectado"]),
      }
    })

    body.registered_date = new Date()

    if(existOngoingDiseaseOccurrences.length == 0) {
      try {
        body.disease_occurrence_id = undefined
        const symptomOccurrence = symptomOccurrenceRepository.create(body)
        await symptomOccurrenceRepository.save(symptomOccurrence)
    
        return response.status(201).json({
          message: "Sintoma registrado com sucesso"
        })
      } catch (error) {
        return response.status(403).json({
          error: "Erro no cadastro do sintoma"
        })
      } 
    }

    else {
      existOngoingDiseaseOccurrences.forEach(async (diseaseOccurrence) => {
        try {
          body.disease_occurrence_id = diseaseOccurrence.id
          const symptomOccurrence = symptomOccurrenceRepository.create(body)
          await symptomOccurrenceRepository.save(symptomOccurrence)
        } catch (error) {
          return response.status(403).json({
            error: "Erro no cadastro do sintoma"
          })
        }
      })
      return response.status(201).json({
        message: "Sintoma registrado com sucesso"
      })
    }
  }

  async list(request: Request, response: Response) {
    const { patient_id, symptom_name, disease_occurrence_id } = request.query
    const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)

    let filters = {}

    if(patient_id) {
      filters = {...filters, patient_id: String(patient_id)}
    }

    if(symptom_name) {
      filters = {...filters, symptom_name: String(symptom_name)}
    }

    if(disease_occurrence_id) {
      filters = {...filters, disease_occurrence_id: String(disease_occurrence_id)}
    }

    const hasQueryParams = Object.keys(filters).length

    if(!hasQueryParams) {
      const occurrencesList = await symptomOccurrenceRepository.find()
      return response.status(200).json(occurrencesList)
    } else {
      const symptomRepository = getCustomRepository(SymptomRepository)
      const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
      const patientsRepository = getCustomRepository(PatientsRepository)

      if(patient_id) {
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
        const isValidDiseaseOccurrence = await diseaseOccurrenceRepository.findOne({
          id: String(disease_occurrence_id)
        })
  
        if(!isValidDiseaseOccurrence) {
          return response.status(404).json({
            error: "Ocorrência de doença não encontrada"
          })
        }
      }
      const occurrencesList = await symptomOccurrenceRepository.find(filters)

      return response.status(200).json(occurrencesList)
    }
  }

  async alterOne(request: Request, response: Response) {
    const body = request.body
    const { symptom_occurrence_id } = request.params

    const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)

    const isValidSymptomOccurrence = await symptomOccurrenceRepository.findOne({ 
      id: symptom_occurrence_id
    })

    if(!isValidSymptomOccurrence) {
      return response.status(404).json({
        error: "Ocorrência de sintoma inválida"
      })
    }

    try {
      await symptomOccurrenceRepository.createQueryBuilder()
        .update(SymptomOccurrence)
        .set(body)
        .where("id = :id", { id: symptom_occurrence_id })
        .execute()
      return response.status(200).json({
        message: "Ocorrência de doença atualizada"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na atualização do sintoma"
      })
    }
  }

  async deleteOne(request: Request, response: Response) {
    const { symptom_occurrence_id } = request.params

    const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)

    const isValidSymptomOccurrence = await symptomOccurrenceRepository.findOne({ 
      id: symptom_occurrence_id
    })

    if(!isValidSymptomOccurrence) {
      return response.status(404).json({
        error: "Ocorrência de sintoma inválida"
      })
    }

    try {
      await symptomOccurrenceRepository.createQueryBuilder()
        .delete()
        .from(SymptomOccurrence)
        .where("id = :id", { id: symptom_occurrence_id })
        .execute()
      return response.status(200).json({
        message: "Ocorrência de doença deletada"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na deleção do sintoma"
      })
    }
  }
}

export { SymptomOccurrenceController }