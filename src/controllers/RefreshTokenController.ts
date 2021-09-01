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
      return response.status(401).json({
        error: "Refresh token não encontrado",
        code: "refresh.token.invalid"
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
        return response.status(401).json({
          error: "Erro na deleção do refresh token",
          code: "refresh.token.deletion"
        })
      }

      return response.status(401).json({
        error: "Refresh token expirado",
        code: "refresh.token.expired"
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
          type: 'system_user'
        })

        const refreshTokenBody = refreshTokenRepository.create({
          systemUserId: isSystemUserId,
          expiresIn: refreshTokenExpiresIn()
        })

        const refreshToken = await refreshTokenRepository.save(refreshTokenBody)
        
        return response.status(200).json({ token, refreshToken: refreshToken.id })

      } else {
        return response.status(401).json({
          error: "Erro na geração do refresh token",
          code: "refresh.token.generation"
        })
      }
    } catch (error) {
      return response.status(401).json({
        error: "Erro na criação do refresh token",
        code: "refresh.token.creation"
      })
    }
  }
}

export { RefreshTokenController }