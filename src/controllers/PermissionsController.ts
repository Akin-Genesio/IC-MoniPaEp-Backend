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
        error: "User does not exist"
      })
    }

    const permissionExists = await permissionsRepository.findOne({
      userId: body.userId
    })

    if(permissionExists) {
      return response.status(406).json({
        error: "Permission has already been assigned"
      })
    }

    try {
      const permissions = permissionsRepository.create(body)
      await permissionsRepository.save(permissions)

      return response.status(201).json(permissions)
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }

  async list (request: Request, response: Response) {
    const permissionsRepository = getCustomRepository(PermissionsRepository)
    const permissionsList = await permissionsRepository.find()

    return response.status(200).json(permissionsList)
  }

  async getOne (request: Request, response: Response) {
    const { user_id } = request.params
    
    const permissionsRepository = getCustomRepository(PermissionsRepository)
    const userExists = await permissionsRepository.findOne({
      userId: user_id
    })

    if(!userExists) {
      return response.status(406).json({
        error: "User does not exist"
      })
    }

    return response.status(200).json(userExists)
  }

  async alterOne(request: Request, response: Response){
    const body = request.body
    const { user_id } = request.params

    const permissionsRepository = getCustomRepository(PermissionsRepository)

    const userExists = await permissionsRepository.findOne({
      userId: user_id
    })
    
    if(!userExists){
      return response.status(404).json({
        error: "User not found"
      })
    }

    try {
      await permissionsRepository.createQueryBuilder()
        .update(Permissions)
        .set(body)
        .where("userId = :id", { id: user_id })
        .execute();
      return response.status(200).json({
        message: "Permissions updated!"
      })
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }

  async deleteOne(request: Request, response: Response){
    const { user_id } = request.params

    const permissionsRepository = getCustomRepository(PermissionsRepository)

    const userExists = await permissionsRepository.findOne({
      userId: user_id
    })
    
    if(!userExists){
      return response.status(404).json({
        error: "User not found"
      })
    }

    try {
      await permissionsRepository.createQueryBuilder()
        .delete()
        .from(Permissions)
        .where("userId = :id", { id: user_id })
        .execute();
      return response.status(200).json({
        message: "Permissions excluded!"
      })
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }
}

export { PermissionsController }