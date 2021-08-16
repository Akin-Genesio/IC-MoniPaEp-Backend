import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SymptomOccurrence } from "../models";
import { DiseaseOccurrenceRepository, SymptomOccurrenceRepository, SymptomRepository } from "../repositories";
class SymptomOccurrenceController {
  async create(request: Request, response: Response){
    const body = request.body

    try {
      body.symptom_name = body.symptom_name.trim()
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }

    const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)
    const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
    const symptomRepository = getCustomRepository(SymptomRepository)

    const IsValidDiseaseOccurrence = await diseaseOccurrenceRepository.findOne({
      id: body.disease_occurrence_id
    })

    if(!IsValidDiseaseOccurrence) {
      return response.status(404).json({
        error: "Disease occurrence id not valid!"
      })
    }
    
    const IsValidSymptom = await symptomRepository.findOne({
      symptom: body.symptom_name
    })

    if(!IsValidSymptom) {
      return response.status(404).json({
        error: "Symptom not found!"
      })
    }

    const IsSymptomAlreadyRegistered = await symptomOccurrenceRepository.findOne({
      disease_occurrence_id: body.disease_occurrence_id,
      symptom_name: body.symptom_name
    })

    if(IsSymptomAlreadyRegistered) {
      return response.status(406).json({
        error: "Symptom has already been registered for this occurrence"
      })
    }

    try {
      const symptomOccurrence = symptomOccurrenceRepository.create(body)
      await symptomOccurrenceRepository.save(symptomOccurrence)
  
      return response.status(201).json(symptomOccurrence)
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }

  async list(request: Request, response: Response) {
    const {disease_occurrence_id, symptom_name} = request.query
    const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)

    if(!disease_occurrence_id && !symptom_name) {
      const occurrencesList = await symptomOccurrenceRepository.find()
      return response.status(200).json(occurrencesList)
    } else if (!disease_occurrence_id && symptom_name) {
      const symptomRepository = getCustomRepository(SymptomRepository)
      const IsValidSymptom = await symptomRepository.findOne({
        symptom: String(symptom_name)
      })

      if(!IsValidSymptom) {
        return response.status(404).json({
          error: "Symptom not found!"
        })
      }

      const occurrencesList = await symptomOccurrenceRepository.find({
        symptom_name: String(symptom_name)
      })

      return response.status(200).json(occurrencesList)
    } else if(disease_occurrence_id && !symptom_name) {
      const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
      const IsValidDiseaseOccurrence = await diseaseOccurrenceRepository.findOne({
        id: String(disease_occurrence_id)
      })

      if(!IsValidDiseaseOccurrence) {
        return response.status(404).json({
          error: "Disease occurrence id not valid!"
        })
      }

      const occurrencesList = await symptomOccurrenceRepository.find({
        disease_occurrence_id: String(disease_occurrence_id)
      })

      return response.status(200).json(occurrencesList)
    } else {
      const symptomRepository = getCustomRepository(SymptomRepository)
      const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)

      const IsValidSymptom = await symptomRepository.findOne({
        symptom: String(symptom_name)
      })

      if(!IsValidSymptom) {
        return response.status(404).json({
          error: "Symptom not found!"
        })
      }

      const IsValidDiseaseOccurrence = await diseaseOccurrenceRepository.findOne({
        id: String(disease_occurrence_id)
      })

      if(!IsValidDiseaseOccurrence) {
        return response.status(404).json({
          error: "Disease occurrence id not valid!"
        })
      }

      const occurrencesList = await symptomOccurrenceRepository.find({
        disease_occurrence_id: String(disease_occurrence_id),
        symptom_name: String(symptom_name)
      })

      return response.status(200).json(occurrencesList)
    }
  }

  async alterOne(request: Request, response: Response) {
    const body = request.body
    const {disease_occurrence_id, symptom_name} = request.params

    const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)
    const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
    const symptomRepository = getCustomRepository(SymptomRepository)

    const IsValidSymptom = await symptomRepository.findOne({
      symptom: symptom_name
    })

    if(!IsValidSymptom) {
      return response.status(404).json({
        error: "Symptom not found!"
      })
    }

    const IsValidDiseaseOccurrence = await diseaseOccurrenceRepository.findOne({
      id: disease_occurrence_id
    })

    if(!IsValidDiseaseOccurrence) {
      return response.status(404).json({
        error: "Disease occurrence id not valid!"
      })
    }

    const IsValidSymptomOccurrence = await symptomOccurrenceRepository.findOne({
      disease_occurrence_id: String(disease_occurrence_id),
      symptom_name: String(symptom_name)
    })


    if(!IsValidSymptomOccurrence) {
      return response.status(404).json({
        error: "Symptom not registered for this disease occurrence"
      })
    }

    try {
      await symptomOccurrenceRepository.createQueryBuilder()
        .update(SymptomOccurrence)
        .set(body)
        .where("disease_occurrence_id = :disease_occurrence_id and symptom_name = :symptom_name", 
          {symptom_name: symptom_name, disease_occurrence_id: disease_occurrence_id})
        .execute()
      return response.status(200).json(body)
    } catch (error) {
      return response.status(403).json({
        error: "Symptom already registered for this disease occurrence"
      })
    }
  }

  async deleteOne(request: Request, response: Response) {
    const {disease_occurrence_id, symptom_name} = request.params

    const symptomOccurrenceRepository = getCustomRepository(SymptomOccurrenceRepository)
    const diseaseOccurrenceRepository = getCustomRepository(DiseaseOccurrenceRepository)
    const symptomRepository = getCustomRepository(SymptomRepository)

    const IsValidSymptom = await symptomRepository.findOne({
      symptom: symptom_name
    })

    if(!IsValidSymptom) {
      return response.status(404).json({
        error: "Symptom not found!"
      })
    }

    const IsValidDiseaseOccurrence = await diseaseOccurrenceRepository.findOne({
      id: disease_occurrence_id
    })

    if(!IsValidDiseaseOccurrence) {
      return response.status(404).json({
        error: "Disease occurrence id not valid!"
      })
    }

    const IsValidSymptomOccurrence = await symptomOccurrenceRepository.findOne({
      disease_occurrence_id: disease_occurrence_id,
      symptom_name: symptom_name
    })


    if(!IsValidSymptomOccurrence) {
      return response.status(404).json({
        error: "Symptom occurrence not found"
      })
    }

    try {
      await symptomOccurrenceRepository.createQueryBuilder()
        .delete()
        .from(SymptomOccurrence)
        .where("disease_occurrence_id = :disease_occurrence_id and symptom_name = :symptom_name", 
          {symptom_name: symptom_name, disease_occurrence_id: disease_occurrence_id})
        .execute()
      return response.status(200).json({
        message: "Symptom occurrence deleted"
      })
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }
}

export { SymptomOccurrenceController }