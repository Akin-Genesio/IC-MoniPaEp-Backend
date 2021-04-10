import { Request, Response } from "express";
import { getCustomRepository } from 'typeorm';
import { Patient } from "../models";
import { PatientsRepository } from "../repositories/PatientsRepository";

class PatientController{
    async create(request: Request, response: Response){
        const body = request.body;
        
        const patientsRepository = getCustomRepository(PatientsRepository)

        const patientAlreadyExists = await patientsRepository.findOne({
            email: body.email
        })

        if(patientAlreadyExists){
            return response.status(400).json({
                error: "Patient already exists"
            })
        }

        const patient = patientsRepository.create(body)

        await patientsRepository.save(patient)

        return response.status(201).json(patient)
    }

    async list(request: Request, response: Response){
        const patientsRepository = getCustomRepository(PatientsRepository)

        const patientsList = await patientsRepository.find()

        console.log(patientsList)

        return response.json(patientsList)
    }

    async getOne(request: Request, response: Response){
        const {patient_id} = request.params

        const patientsRepository = getCustomRepository(PatientsRepository)

        const patient = await patientsRepository.findOne({
            id: patient_id
        })
        
        if(!patient){
            return response.status(404).json({
                error: "Patient not found"
            })
        }

        return response.status(302).json(patient)
    }

    async alterOne(request: Request, response: Response){
        const body = request.body
        const {patient_id} = request.params

        const patientsRepository = getCustomRepository(PatientsRepository)

        const patient = await patientsRepository.findOne({
            id: patient_id
        })
        
        if(!patient){
            return response.status(404).json({
                error: "Patient not found"
            })
        }

        patientsRepository.createQueryBuilder()
        .update(Patient)
        .set(body)
        .where("id = :id", { id: patient_id })
        .execute();

        return response.status(200).json(body)
    }

    async deleteOne(request: Request, response: Response){
        const {patient_id} = request.params

        const patientsRepository = getCustomRepository(PatientsRepository)

        const patient = await patientsRepository.findOne({
            id: patient_id
        })
        
        if(!patient){
            return response.status(404).json({
                error: "Patient not found"
            })
        }

        patientsRepository.createQueryBuilder()
        .delete()
        .from(Patient)
        .where("id = :id", { id: patient_id })
        .execute();

        return response.status(200).json("Patient Deleted")
    }
}

export { PatientController };
