import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Permissions } from "../models";
import { PermissionsRepository, SystemUserRepository } from "../repositories";

class PermissionsController {
  async create(request: Request, response: Response){
    const body = request.body

    const permissionsRepository = getCustomRepository(PermissionsRepository)
    const systemUserRepository = getCustomRepository(SystemUserRepository)

    const userExists = await systemUserRepository.findOne({
      id: body.userId
    })

    if(!userExists) {
      return response.status(406).json({
        error: "Usuário não encontrado"
      })
    }

    const permissionExists = await permissionsRepository.findOne({
      userId: body.userId
    })

    if(permissionExists) {
      return response.status(403).json({
        error: "Permissões já foram atribuídas à esse usuário"
      })
    }

    try {
      body.localAdm = false
      body.generalAdm = false
      body.authorized = false
      const permissions = permissionsRepository.create(body)
      await permissionsRepository.save(permissions)

      return response.status(201).json({
        success: "Permissões do usuário criadas com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na criação das permissões do usuário"
      })
    }
  }

  async list(request: Request, response: Response) {
    const { id, page, name } = request.query
    const take = 10
    let filters = {}
    
    const permissionsRepository = getCustomRepository(PermissionsRepository)
    
    let options: any = {
      where: filters,
      relations: ["systemUser"],
      order: {
        authorized: 'ASC',
        localAdm: 'ASC',
        generalAdm: 'ASC',
      }
    }

    if(page) {
      options = { ...options, take, skip: ((Number(page) - 1) * take) }
    }

    if(id) {
      filters = { ...filters, userId: String(id) }

      const userIsValid = await permissionsRepository.findOne({
        userId: String(id)
      })

      if(!userIsValid) {
        return response.status(403).json({
          error: "Usuário não encontrado"
        })
      }
    }

    if(name) {
      const skip = page ? ((Number(page) - 1) * take) : 0 
      const limit = page ? take : 99999999
      try {
        const items = await permissionsRepository.createQueryBuilder("permissions")
          .leftJoinAndSelect("permissions.systemUser", "systemUser")
          .where("systemUser.name like :name", { name: `%${name}%` })
          .skip(skip)
          .take(limit)
          .getManyAndCount()
        return response.status(200).json({
          systemUsers: items[0],
          totalSystemUsers: items[1],
        })
      } catch (error) {
        return response.status(403).json({
          error: "Erro na listagem de permissões"
        })
      }
    }

    const permissionsList = await permissionsRepository.findAndCount(options)

    return response.status(200).json({
      systemUsers: permissionsList[0],
      totalSystemUsers: permissionsList[1],
    })
  }

  async alterOne(request, response: Response){
    const body = request.body
    const tokenPayload = request.tokenPayload
    const { id } = request.params

    const permissionsRepository = getCustomRepository(PermissionsRepository)

    const userExists = await permissionsRepository.findOne({
      userId: id
    })
    
    if(!userExists){
      return response.status(404).json({
        error: "Usuário não encontrado"
      })
    }

    if(body.generalAdm !== undefined) {
      const tokenUser = await permissionsRepository.findOne({
        userId: tokenPayload.id
      })
      if(!tokenUser.generalAdm) {
        return response.status(404).json({
          error: "Usuário sem permissão para tal alteração"
        })
      }
    }

    try {
      await permissionsRepository.createQueryBuilder()
        .update(Permissions)
        .set(body)
        .where("userId = :id", { id })
        .execute();
      return response.status(200).json({
        success: "Permissões atualizadas com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na atualização de permissões"
      })
    }
  }

  async deleteOne(request: Request, response: Response){
    const { id } = request.params

    const permissionsRepository = getCustomRepository(PermissionsRepository)

    const userExists = await permissionsRepository.findOne({
      userId: id
    })
    
    if(!userExists){
      return response.status(404).json({
        error: "Usuário não encontrado"
      })
    }

    try {
      await permissionsRepository.createQueryBuilder()
        .delete()
        .from(Permissions)
        .where("userId = :id", { id })
        .execute();
      return response.status(200).json({
        message: "Permissões deletadas com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na deleção das permissões"
      })
    }
  }
}

export { PermissionsController }