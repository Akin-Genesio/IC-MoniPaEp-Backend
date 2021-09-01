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
        error: "Email/CPF já cadastrado"
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
      return response.status(201).json({
        success: "Usuário criado com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na criação do usuário"
      })
    }
  }

  async login(request: Request, response: Response) {
    let hash
    
    try {
      [, hash] = request.headers.authorization.split(' ')
    } catch (error) {
      return response.status(401).json({
        error: "Credenciais necessárias"
      })
    }

    const [email, password] = Buffer.from(hash, 'base64').toString().split(':')
    
    const systemUserRepository = getCustomRepository(SystemUserRepository)
    const userExists = await systemUserRepository.findOne({
      where: { email }, 
      select: ['id', 'email', 'password', 'name', 'department']
    })

    if (!userExists) {
      return response.status(401).json({
        error: "Usuário não encontrado"
      })
    }

    const systemUserId = userExists.id
    const validPassword = await bcrypt.compare(password, userExists.password)

    if(!validPassword) {
      return response.status(400).json({
        error: "Email e/ou senha inválidos"
      })
    }

    try {
      const permissionsRepository = getCustomRepository(PermissionsRepository)
      const userPermissions = await permissionsRepository.findOne({
        userId: systemUserId
      })

      if(!userPermissions) {
        return response.status(400).json({
          error: "Usuário sem permissões cadastradas"
        })
      }

      if(!userPermissions.authorized) {
        return response.status(400).json({
          error: "Usuário não autorizado"
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
        type: 'system_user'
      })

      userExists.password = undefined
      const permissions: string[] = []
      const roles: string[] = ['system.user']

      if(userExists.department === "USM") {
        permissions.push('usm.user')
      }

      if(userExists.department === "SVS") {
        permissions.push('svs.user')
      }

      if(userPermissions.localAdm) {
        roles.push('local.admin')
      }

      if(userPermissions.generalAdm) {
        roles.push('general.admin')
      }

      return response.status(200).json({
        user: userExists,
        permissions,
        roles,
        token,
        refreshToken: refreshToken.id,
      })

    } catch (error) {
      return response.status(400).json({
        error: "Erro no login"
      })
    }
  }

  async list(request: Request, response: Response) {
    const { id, department } = request.query
    let filters = {}
    
    const systemUserRepository = getCustomRepository(SystemUserRepository)

    if(id) {
      filters = { ...filters, id: String(id) }

      const user = await systemUserRepository.findOne({
        id: String(id)
      })
    
      if(!user){
        return response.status(404).json({
          error: "Usuário não encontrado"
        })
      }
    }

    if(department) {
      filters = { ...filters, department: String(department) }
    }

    const users = await systemUserRepository.find(filters)

    return response.status(200).json(users)
  }

  async getOneWithToken(request, response: Response) {
    const { id, type } = request.tokenPayload

    if(type !== 'system_user') {
      return response.status(401).json({
        error: "Token inválido para essa requisição"
      })
    }
    
    const systemUserRepository = getCustomRepository(SystemUserRepository)
    const permissionsRepository = getCustomRepository(PermissionsRepository)

    const user = await systemUserRepository.findOne({
      where: { id }, 
      select: ['id', 'email', 'password', 'name', 'department']
    })

    if(!user) {
      return response.status(401).json({
        error: "Usuário inválido"
      })
    }

    const userPermissions = await permissionsRepository.findOne({
      userId: id
    })

    if(!userPermissions) {
      return response.status(400).json({
        error: "Usuário sem permissões cadastradas"
      })
    }


    user.password = undefined
    const permissions: string[] = []
    const roles: string[] = ['system.user']

    if(user.department === "USM") {
      permissions.push('usm.user')
    }

    if(user.department === "SVS") {
      permissions.push('svs.user')
    }

    if(userPermissions.localAdm) {
      roles.push('local.admin')
    }

    if(userPermissions.generalAdm) {
      roles.push('general.admin')
    }

    return response.status(200).json({
      user,
      permissions,
      roles,
    })
  }

  async alterOne(request: Request, response: Response) {
    const body = request.body
    const { id } = request.params

    const systemUserRepository = getCustomRepository(SystemUserRepository)
    const userExists = await systemUserRepository.findOne({ id })

    if(!userExists){
      return response.status(401).json({
        error: "Usuário inválido"
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
        .where("id = :id", { id })
        .execute()
      return response.status(200).json({
        success: "Usuário atualizado com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na atualização do usuário"
      })
    }
  }

  async deleteOne(request: Request, response: Response) {
    const { id } = request.params

    const systemUserRepository = getCustomRepository(SystemUserRepository)
    const userExists = await systemUserRepository.findOne({ id })

    if(!userExists){
      return response.status(401).json({
        error: "Usuário inválido"
      })
    }

    try {
      await systemUserRepository.createQueryBuilder()
        .delete()
        .from(SystemUser)
        .where("id = :id", { id })
        .execute()
      return response.status(200).json({
        success: "Usuário deletado com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na deleção do usuário"
      })
    }
  }
}

export { SystemUserController }