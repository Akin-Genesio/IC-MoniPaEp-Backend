import { Request, Response } from "express";
import { Patient } from "../models/Patient";
import {getRepository} from 'typeorm'

class PatientController{
    async create(request: Request, response: Response){
        const body = request.body;
        
        const patientsRepository = getRepository(Patient)

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

        return response.json(patient);
    }
}

export {PatientController};