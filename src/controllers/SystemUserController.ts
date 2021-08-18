import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SystemUserRepository } from "../repositories/SystemUserRepository";
import * as jwt from "../jwt"

import bcrypt from 'bcrypt'
import { PermissionsRepository, RefreshTokenRepository } from "../repositories";
import { RefreshToken, SystemUser } from "../models";
import { refreshTokenExpiresIn } from "src/refreshTokenExpiration";
class SystemUserController {
  async create(request: Request, response: Response) {
    const body = request.body

    const permissionRepository = getCustomRepository(PermissionsRepository)
    const systemUserRepository = getCustomRepository(SystemUserRepository)

    const userAlreadyExists = await systemUserRepository.findOne({
      where: [
        { CPF: body.CPF },
        { email: body.email }
      ] 
    })

    if (userAlreadyExists) {
      return response.status(400).json({
        error: "User already registered with this email or CPF"
      })
    }

    body.createdAt = new Date()

    try {
      const user = systemUserRepository.create(body)
      const userSaved: any = await systemUserRepository.save(user)
      const permissions = permissionRepository.create({
        userId: userSaved.id,
        localAdm: false,
        generalAdm: false,
        authorized: false
      })
      await permissionRepository.save(permissions)
    
      userSaved.password = undefined      
      return response.status(201).json({ user: userSaved })
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }

  async login(request: Request, response: Response) {
    let hash
    
    try {
      [, hash] = request.headers.authorization.split(' ')
    } catch (error) {
      return response.status(401).json({
        error: "Credentials required"
      })
    }

    const [email, password] = Buffer.from(hash, 'base64').toString().split(':')
    
    const systemUserRepository = getCustomRepository(SystemUserRepository)
    const userExists: any = await systemUserRepository.findOne({
      where: { email }, 
      select: ['id', 'email', 'password', 'name', 'department']
    })

    if (!userExists) {
      return response.status(401).json({
        error: "User does not exist"
      })
    }

    const systemUserId = userExists.id
    const validPassword = await bcrypt.compare(password, userExists.password)

    if(!validPassword) {
      return response.status(400).json({
        error: "Invalid password"
      })
    }

    try {
      const permissionsRepository = getCustomRepository(PermissionsRepository)
      const userPermissions = await permissionsRepository.findOne({
        userId: systemUserId
      })

      if(!userPermissions) {
        return response.status(400).json({
          error: "User does not have permissions"
        })
      }

      if(!userPermissions.authorized) {
        return response.status(400).json({
          error: "User not authorized"
        })
      }
      
      const refreshTokenRepository = getCustomRepository(RefreshTokenRepository)
      const refreshTokenExists = await refreshTokenRepository.findOne({
        systemUserId
      })
      
      if(refreshTokenExists) {
        await refreshTokenRepository.createQueryBuilder()
        .delete()
        .from(RefreshToken)
        .where("systemUserId = :id", { id: systemUserId })
        .execute()
      }

      const refreshTokenBody = refreshTokenRepository.create({
        systemUserId,
        expiresIn: refreshTokenExpiresIn()
      })

      const refreshToken = await refreshTokenRepository.save(refreshTokenBody)

      const token = jwt.sign({
        id: systemUserId,
        type: 'systemUser'
      })

      return response.status(200).json({
        user: {
          name: userExists.name,
          email: userExists.email,
          department: userExists.department,
        },
        token,
        refreshToken,
      })

    } catch (error) {
      return response.status(400).json({
        error: error.message
      })
    }

  }

  async list(request: Request, response: Response) {
    const systemUserRepository = getCustomRepository(SystemUserRepository)
    const users = await systemUserRepository.find()

    return response.status(200).json(users)
  }

  async getOne(request: Request, response: Response) {
    const {user_id} = request.params
    
    const systemUserRepository = getCustomRepository(SystemUserRepository)
    const user = await systemUserRepository.findOne({
      id: user_id
    })

    if(!user) {
      return response.status(401).json({
        error: "User invalid"
      })
    }

    return response.status(200).json(user)
  }

  async getOneWithToken(request, response: Response) {
    const id = request.tokenPayload.id
    
    const systemUserRepository = getCustomRepository(SystemUserRepository)
    const user = await systemUserRepository.findOne({
      id: id
    })

    if(!user) {
      return response.status(401).json({
        error: "User invalid"
      })
    }
    user.CPF = undefined
    user.createdAt = undefined

    return response.status(200).json(user)
  }

  async alterOne(request: Request, response: Response) {
    const body = request.body
    const {user_id} = request.params

    const systemUserRepository = getCustomRepository(SystemUserRepository)
    const userExists = await systemUserRepository.findOne({
      id: user_id
    })

    if(!userExists){
      return response.status(401).json({
        error: "User invalid"
      })
    }
    
    if(body.password){
      const hash = await bcrypt.hash(body.password, 10)
      body.password = hash
    }

    try {
      await systemUserRepository.createQueryBuilder()
        .update(SystemUser)
        .set(body)
        .where("id = :id", { id: user_id })
        .execute()
      body.password = undefined
      return response.status(200).json(body)
    } catch (error) {
      return response.status(403).json({
        error: "This email or CPF has already been registered"
      })
    }
  }

  async deleteOne(request: Request, response: Response) {
    const {user_id} = request.params

    const systemUserRepository = getCustomRepository(SystemUserRepository)
    const userExists = await systemUserRepository.findOne({
      id: user_id
    })

    if(!userExists){
      return response.status(401).json({
        error: "User invalid"
      })
    }

    try {
      await systemUserRepository.createQueryBuilder()
        .delete()
        .from(SystemUser)
        .where("id = :id", { id: user_id })
        .execute()
      return response.status(200).json({
        message: "System user removed"
      })
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }
}

export { SystemUserController }