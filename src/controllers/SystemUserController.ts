import { Request, Response } from "express";
import { createQueryBuilder, getCustomRepository } from "typeorm";
import { SystemUserRepository } from "../repositories/SystemUserRepository";
import * as jwt from "../jwt"

import bcrypt from 'bcrypt'
import { PermissionsRepository } from "../repositories";
import { SystemUser } from "../models";


class SystemUserController {
    async create(request: Request, response: Response) {
        const body = request.body

        const permissionRepository = getCustomRepository(PermissionsRepository)
        const systemUserRepository = getCustomRepository(SystemUserRepository)

        const userAlreadyExists = await systemUserRepository.findOne({ where: [{ CPF: body.CPF }, { email: body.email }] })

        if (userAlreadyExists) {
            return response.status(400).json({
                error: "User already registered with this email or CPF"
            })
        }

        body.createdAt = new Date()

        const user = systemUserRepository.create(body)

        const userSaved: any = await systemUserRepository.save(user)

        userSaved.password = undefined

        const permissions = permissionRepository.create({
            userId: userSaved.id,
            localAdm: false,
            generalAdm: false
        })

        const permissionsSaved = await permissionRepository.save(permissions)

        const token = jwt.sign({
            id: userSaved.id,
            type: 'systemUser'
        })

        return response.status(201).json({ userSaved, token, permissionsSaved })

    }

    async login(request: Request, response: Response) {
        const [hashType, hash] = request.headers.authorization.split(' ')
        const [email, password] = Buffer.from(hash, 'base64').toString().split(':')
        
        const systemUserRepository = getCustomRepository(SystemUserRepository)
        const userExists: any = await systemUserRepository.findOne({
            where: { email: email }, 
            select: ['id', 'email', 'password']
        })

        if (!userExists) {
            return response.status(401).json({
                error: "User does not exist"
            })
        }

        const validPassword = await bcrypt.compare(password, userExists.password)

        if(validPassword) {
            const token = jwt.sign({
                id: userExists.id,
                type: 'systemUser'
            })
            
            const userId = userExists.id

            return response.status(200).json({user: userId, token})

        } else {
            return response.status(400).json({
                error: "Invalid password"
            })
        }
    }

    async list(request: Request, response: Response) {
        const systemUserRepository = getCustomRepository(SystemUserRepository)
        const users = await systemUserRepository.find()

        return response.status(200).json(users)
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

        try {
            let query = await systemUserRepository.createQueryBuilder()
                .update(SystemUser)
                .set(body)
                .where("id = :id", { id: user_id })
                .execute()
        } catch (error) {
            return response.status(403).json({
                error: error.message
            })
        }

        body.password = undefined
        return response.status(200).json(body)
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
            let query = await systemUserRepository.createQueryBuilder()
                .delete()
                .from(SystemUser)
                .where("id = :id", { id: user_id })
                .execute()
        } catch (error) {
            return response.status(403).json({
                error: error.message
            })
        }

        return response.status(200).json("System user removed")
    }
}

export { SystemUserController }