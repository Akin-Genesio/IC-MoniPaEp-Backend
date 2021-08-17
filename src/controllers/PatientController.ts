import { Request, Response } from "express";
import { getCustomRepository } from 'typeorm';
import bcrypt from 'bcrypt'
import dayjs from 'dayjs'

import * as jwt from "../jwt"
import { Patient, RefreshToken } from "../models";
import { RefreshTokenRepository, PatientsRepository } from "../repositories";
import { PatientAlreadyExistsError } from "../errors";
import { refreshTokenExpiresIn } from "../refreshTokenExpiration";

class PatientController{
  async create(request: Request, response: Response){
    const body = request.body;
    
    const patientsRepository = getCustomRepository(PatientsRepository)

    const patientAlreadyExists = await patientsRepository.findOne({ 
      where: [
        { CPF: body.CPF }, 
        { email: body.email }
      ] 
    })

    if(patientAlreadyExists){
      throw new PatientAlreadyExistsError()
    }

    body.createdAt = new Date()

    try {
      const patientBody = patientsRepository.create(body)
      const patient: any = await patientsRepository.save(patientBody)
      const patientId = patient.id
      
      const refreshTokenRepository = getCustomRepository(RefreshTokenRepository)

      const refreshTokenBody = refreshTokenRepository.create({
        patientId,
        expiresIn: refreshTokenExpiresIn()
      })

      const refreshToken = await refreshTokenRepository.save(refreshTokenBody)

      const token = jwt.sign({
          id: patient.id,
          type: 'patient'
      })

      patient.password = undefined
      return response.status(201).json({ patient, token, refreshToken })
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }

  // async login(request: Request, response: Response){
  //   let hash
  //   try {
  //     [, hash] = request.headers.authorization.split(' ')
  //   } catch (error) {
  //     return response.status(401).json({
  //         error: "Credentials required"
  //     })
  //   }
    
  //   const [email, password] = Buffer.from(hash, 'base64').toString().split(':')

  //   const patientsRepository = getCustomRepository(PatientsRepository)
  //   const patientExists: any = await patientsRepository.findOne({
  //     where: { email: email }, 
  //     select: ['id', 'email', 'password']
  //   })

  //   if (!patientExists) {
  //     return response.status(401).json({
  //       error: "Patient does not exist"
  //     })
  //   }

  //   const validPassword = await bcrypt.compare(password, patientExists.password)

  //   if(validPassword) {
  //     const patientId = patientExists.id
  //     const token = jwt.sign({
  //       id: patientId,
  //       type: 'patient'
  //     })

  //     const refreshTokenRepository = getCustomRepository(RefreshTokenRepository)

  //     const refreshTokenExists = await refreshTokenRepository.find({
  //       patientId
  //     })
      
  //     if(refreshTokenExists) {
  //       await refreshTokenRepository.createQueryBuilder()
  //       .delete()
  //       .from(RefreshToken)
  //       .where("patientId = :id", { id: patientId })
  //       .execute()
  //     }

  //     const refreshTokenBody = refreshTokenRepository.create({
  //       patientId,
  //       expiresIn: dayjs().add(15, 'seconds').unix()
  //     })

  //     const refreshToken = await refreshTokenRepository.save(refreshTokenBody)
      

  //     return response.status(200).json({ patientId, token, refreshToken })
  //   } else {
  //     return response.status(400).json({
  //       error: "Invalid password"
  //     })
  //   }
  // }

  async loginPost(request: Request, response: Response){
    const { email, password } = request.body

    const patientsRepository = getCustomRepository(PatientsRepository)
    const patientExists: any = await patientsRepository.findOne({
      where: { email }, 
      select: ['id', 'email', 'password']
    })

    if (!patientExists) {
      return response.status(401).json({
        error: "Patient does not exist"
      })
    }

    const validPassword = await bcrypt.compare(password, patientExists.password)

    if(validPassword) {
      const patientId = patientExists.id

      const token = jwt.sign({
        id: patientId,
        type: 'patient'
      })

      const refreshTokenRepository = getCustomRepository(RefreshTokenRepository)

      const refreshTokenExists = await refreshTokenRepository.find({
        patientId
      })
      
      if(refreshTokenExists) {
        await refreshTokenRepository.createQueryBuilder()
        .delete()
        .from(RefreshToken)
        .where("patientId = :id", { id: patientId })
        .execute()
      }

      const refreshTokenBody = refreshTokenRepository.create({
        patientId,
        expiresIn: refreshTokenExpiresIn()
      })

      const refreshToken = await refreshTokenRepository.save(refreshTokenBody)

      return response.status(200).json({ patientId, token, refreshToken })
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

  async listActiveAccounts(request: Request, response: Response){
    const patientsRepository = getCustomRepository(PatientsRepository)
    const patientsList = await patientsRepository.find(
      {activeAccount: true}
    )

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

  async getOneWithToken(request, response: Response) {
    const id = request.tokenPayload.id
    
    const patientsRepository = getCustomRepository(PatientsRepository)
    const user = await patientsRepository.findOne({
      id: id
    })

    if(!user) {
      return response.status(401).json({
        error: "User invalid"
      })
    }
    
    return response.status(200).json(user)
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
      await patientsRepository.createQueryBuilder()
        .update(Patient)
        .set(body)
        .where("id = :id", { id: patient_id })
        .execute();
      body.password = undefined
      return response.status(200).json(body)
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
    
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
      await patientsRepository.createQueryBuilder()
        .delete()
        .from(Patient)
        .where("id = :id", { id: patient_id })
        .execute();
      return response.status(200).json({
        message: "Patient deleted"
      })
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }

  async deactivateAccount(request: Request, response: Response){
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
      await patientsRepository.createQueryBuilder()
        .update(Patient)
        .set({activeAccount: false})
        .where("id = :id", { id: patient_id })
        .execute();
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }

    return response.status(200).json("deactivated account")
  }
    
}

export { PatientController };
