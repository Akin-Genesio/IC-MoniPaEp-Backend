import { Request, Response } from "express";
import { getCustomRepository, IsNull } from "typeorm";

import { DiseaseOccurrence, SymptomOccurrence } from "../models";
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

    for (const symptomOccurrence of notAssignedSymptomOccurrences) {
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
      for (let i = 1; i < numberOfDiseaseOccurrences; i++) {
        for (const symptomOccurrence of notAssignedSymptomOccurrences) {
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
    const {patient_id} = request.query
    const {disease_name} = request.query
    
    const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
    if(!patient_id && !disease_name){
      const OccurrencesList = await diseaseOccurrenceRepository.find()
      return response.status(200).json(OccurrencesList)
    }
    else if(!patient_id && disease_name){
      const diseaseRepository = getCustomRepository(DiseaseRepository)

      const IsValidDisease = await diseaseRepository.findOne({
        name: String(disease_name)
      })

      if (!IsValidDisease){
        return response.status(404).json({
          error: "Disease name is not valid"
        })
      }

      const OccurrencesList = await diseaseOccurrenceRepository.find({
        disease_name: String(disease_name)
      })

      return response.status(200).json(OccurrencesList)
    }
    else if(patient_id && !disease_name){
      const patientRepository = getCustomRepository(PatientsRepository)

      const IsValidPatient = await patientRepository.findOne({
        id: String(patient_id)
      })

      if(!IsValidPatient){
        return response.status(404).json({
          error: "Patient id is not valid"
        })
      }

      const OccurrencesList = await diseaseOccurrenceRepository.find({
        patient_id: String(patient_id)
      })

      return response.status(200).json(OccurrencesList)
    }
    else {
      const patientRepository = getCustomRepository(PatientsRepository)
      const diseaseRepository = getCustomRepository(DiseaseRepository)

      const IsValidPatient = await patientRepository.findOne({
        id: String(patient_id)
      })

      if(!IsValidPatient){
        return response.status(404).json({
          error: "Patient id is not valid"
        })
      }

      const IsValidDisease = await diseaseRepository.findOne({
        name: String(disease_name)
      })

      if (!IsValidDisease){
        return response.status(404).json({
          error: "Disease name is not valid"
        })
      }

      const OccurrencesList = await diseaseOccurrenceRepository.find({
        patient_id: String(patient_id),
        disease_name: String(disease_name)
      })

      return response.status(200).json(OccurrencesList)
    }
  }

  async getOne(request: Request, response: Response) {
    const {id} = request.params
    const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
    
    const OccurrenceItem = await diseaseOccurrenceRepository.findOne({
      id: id
    })

    if(!OccurrenceItem){
      return response.status(404).json({
        error: "Disease occurrence not found"
      })
    }

    return response.status(200).json(OccurrenceItem)
  }

  async alterOne(request: Request, response: Response) {
    const body = request.body
    const { id } = request.params

    const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
    const diseaseRepository = getCustomRepository(DiseaseRepository)

    const diseaseOccurrence = await diseaseOccurrenceRepository.findOne({
      id: id
    })

    if(!diseaseOccurrence){
      return response.status(404).json({
        error: "Disease occurrence not found"
      })
    }

    const diseaseName = await diseaseRepository.findOne({
      name: body.disease_name
    })

    if(!diseaseName){
      return response.status(404).json({
        error: "Disease name not found"
      })
    }

    try {
      await diseaseOccurrenceRepository.createQueryBuilder()
        .update(DiseaseOccurrence)
        .set(body)
        .where("id = :id", {id: id})
        .execute()
      return response.status(200).json(body)
    } catch (error) {
      return response.status(404).json({
        error: error.message
      })
    }
  }

  async deleteOne(request: Request, response: Response) {
    const {id} = request.params
    
    const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

    const diseaseOccurrence = await diseaseOccurrenceRepository.findOne({
      id: id
    })

    if(!diseaseOccurrence){
      return response.status(404).json({
        error: "Disease occurrence not found"
      })
    }

    try {
      await diseaseOccurrenceRepository.createQueryBuilder()
        .delete()
        .from(DiseaseOccurrence)
        .where("id = :id", {id: id})
        .execute()
      return response.status(200).json({
        message: "Disease Occurrence deleted!"
      })
    } catch (error) {
      return response.status(404).json({
        error: error.message
      })
    }
  }
}

export { DiseaseOccurrenceController }