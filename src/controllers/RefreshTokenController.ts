import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import dayjs from 'dayjs'
import * as jwt from "../jwt"

import { RefreshToken } from "../models";
import { RefreshTokenRepository } from "../repositories";
import { refreshTokenExpiresIn } from "../refreshTokenExpiration";

class RefreshTokenController {
  async create(request: Request, response: Response){
    const { refreshToken } = request.body

    const refreshTokenRepository = getCustomRepository(RefreshTokenRepository)

    const refreshTokenExists = await refreshTokenRepository.findOne({
      id: refreshToken
    })

    if(!refreshTokenExists) {
      return response.status(404).json({
        error: "Refresh token not valid"
      })
    }

    const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshTokenExists.expiresIn))

    if(refreshTokenExpired) {
      try {
        await refreshTokenRepository.createQueryBuilder()
          .delete()
          .from(RefreshToken)
          .where("id = :id", { id: refreshTokenExists.id })
          .execute();
      } catch (error) {
        return response.status(404).json({
          error: "Refresh token deleting error"
        })
      }

      return response.status(404).json({
        error: "Refresh token expired"
      })
    } 

    const isPatientId = refreshTokenExists.patientId
    const isSystemUserId = refreshTokenExists.systemUserId

    try {
      await refreshTokenRepository.createQueryBuilder()
        .delete()
        .from(RefreshToken)
        .where("id = :id", { id: refreshTokenExists.id })
        .execute();

      if(isPatientId) {
        const token = jwt.sign({
          id: isPatientId,
          type: 'patient'
        })

        const refreshTokenBody = refreshTokenRepository.create({
          patientId: isPatientId,
          expiresIn: refreshTokenExpiresIn()
        })

        const refreshToken = await refreshTokenRepository.save(refreshTokenBody)
        
        return response.status(200).json({ isPatientId, token, refreshToken })

      } else if(isSystemUserId) {
        const token = jwt.sign({
          id: isSystemUserId,
          type: 'systemUser'
        })

        const refreshTokenBody = refreshTokenRepository.create({
          systemUserId: isSystemUserId,
          expiresIn: refreshTokenExpiresIn()
        })

        const refreshToken = await refreshTokenRepository.save(refreshTokenBody)
        
        return response.status(200).json({ isSystemUserId, token, refreshToken })

      } else {
        return response.status(403).json({
          error: "Refresh token generation error"
        })
      }
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }
}

export { RefreshTokenController }