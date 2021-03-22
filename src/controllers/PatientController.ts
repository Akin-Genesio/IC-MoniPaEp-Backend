import { Request, Response } from "express";
import { getCustomRepository } from 'typeorm';
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

        return response.json(patient);
    }
}

export { PatientController };
