import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppointmentsRepository, PatientsRepository } from "../repositories";

class AppointmentController {
    async create(request: Request, response: Response){
        const body = request.body

        const appointmentsRepository = getCustomRepository(AppointmentsRepository)
        const patientsRepository = getCustomRepository(PatientsRepository)

        const patientExists = await patientsRepository.findOne({
            id: body.patient_id
        })

        if(!patientExists){
            return response.status(404).json({
                error: "Invalid id, patient not found"
            })
        }

        const appointment = appointmentsRepository.create(body)

        await appointmentsRepository.save(appointment)

        return response.status(201).json(appointment)
    }
}

export {AppointmentController}