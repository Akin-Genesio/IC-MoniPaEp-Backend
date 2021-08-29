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

  async list (request: Request, response: Response) {
    const { id } = request.query

    let filters = {}

    const permissionsRepository = getCustomRepository(PermissionsRepository)
    
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

    const permissionsList = await permissionsRepository.find({
      where: filters,
      select: ["authorized", "localAdm", "generalAdm"],
      relations: ["systemUser"]
    })

    return response.status(200).json(permissionsList)
  }

  async alterOne(request: Request, response: Response){
    const body = request.body
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