import { Request, Response } from "express";
import { getCustomRepository } from 'typeorm';
import { Patient } from "../models";
import { PatientsRepository } from "../repositories/PatientsRepository";

import bcrypt from 'bcrypt'
import * as jwt from "../jwt"

class PatientController{
    async create(request: Request, response: Response){
        const body = request.body;
        
        const patientsRepository = getCustomRepository(PatientsRepository)

        const patientAlreadyExists = await patientsRepository.findOne({ where: [{ CPF: body.CPF }, { email: body.email }] })

        if(patientAlreadyExists){
            return response.status(400).json({
                error: "Patient already registered with this email or CPF"
            })
        }

        try {
            const patientBody = patientsRepository.create(body)
            const patient: any = await patientsRepository.save(patientBody)
            const token = jwt.sign({
                id: patient.id,
                type: 'patient'
            })
            patient.password = undefined
            return response.status(201).json({patient, token})
        } catch (error) {
            return response.status(403).json({
                error: error.message
            })
        }
        
    }

    async login(request: Request, response: Response){
        let hash
        try {
            [, hash] = request.headers.authorization.split(' ')
        } catch (error) {
            return response.status(401).json({
                error: "Credentials required"
            })
        }
        
        const [email, password] = Buffer.from(hash, 'base64').toString().split(':')

        const patientsRepository = getCustomRepository(PatientsRepository)
        const patientExists: any = await patientsRepository.findOne({
            where: { email: email }, 
            select: ['id', 'email', 'password']
        })

        if (!patientExists) {
            return response.status(401).json({
                error: "Patient does not exist"
            })
        }

        const validPassword = await bcrypt.compare(password, patientExists.password)

        if(validPassword) {
            const token = jwt.sign({
                id: patientExists.id,
                type: 'patient'
            })
            
            const patientId = patientExists.id

            return response.status(200).json({patientId, token})

        } else {
            return response.status(400).json({
                error: "Invalid password"
            })
        }

    }

    async list(request: Request, response: Response){
        const patientsRepository = getCustomRepository(PatientsRepository)
        const patientsList = await patientsRepository.find()

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

        if(body.password){
            const hash = await bcrypt.hash(body.password, 10)
            body.password = hash
        }

        try {
            let query = await patientsRepository.createQueryBuilder()
                .update(Patient)
                .set(body)
                .where("id = :id", { id: patient_id })
                .execute();
        } catch (error) {
            return response.status(403).json({
                error: error.message
            })
        }

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

        try {
            let query = await patientsRepository.createQueryBuilder()
                .delete()
                .from(Patient)
                .where("id = :id", { id: patient_id })
                .execute();
        } catch (error) {
            return response.status(403).json({
                error: error.message
            })
        }

        return response.status(200).json("Patient Deleted")
    }
}

export { PatientController };
