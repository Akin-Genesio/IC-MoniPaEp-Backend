import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { getCustomRepository } from 'typeorm'
import { PermissionsRepository, SystemUserRepository } from './repositories'

type TokenPayload = {
    id: string;
    type: string;
} 

const secret = 'wLbITYtzyd0hOOOPVQGRPnQh84RRY3KPiybKYwhzin8TCejiBgJoos22RBrxiWU'

export const sign = (payload: TokenPayload) => jwt.sign(payload, secret, {expiresIn: 60*60*24})
export const verify = (token: string) => jwt.verify(token, secret)

export const authMiddleware = async (request, response: Response, next) => {
    let token
    if (request.headers.authorization) {
        [, token] = request.headers.authorization.split(' ')
    } else {
        return response.status(401).json({
            error: "Token required"
        })
    }
    
    try {
        const payload: any =  verify(token)
        request.tokenPayload = payload
        return next()
    } catch (error) {
        return response.status(401).json({
            error: "Invalid/expired token"
        })
    }
}

export const adminMiddleware = async (request, response: Response, next) => {
    const id = request.tokenPayload.id
    const type = request.tokenPayload.type

    if (type !== "systemUser") {
        return response.status(401).json({
            error: "Not authorized"
        })
    }
    
    const permissionsRepository = getCustomRepository(PermissionsRepository)

    const user = await permissionsRepository.findOne({
        userId: id
    })

    if(!user) {
        return response.status(401).json({
            error: "User not valid"
        })
    }
    
    if(user.generalAdm) {
        return next()
    }
    
    return response.status(401).json({
        error: "Not authorized"
    })
}

export const localAdminMiddleware = async (request, response: Response, next) => {
    const id = request.tokenPayload.id
    const type = request.tokenPayload.type

    if (type !== "systemUser") {
        return response.status(401).json({
            error: "Not authorized"
        })
    }
    
    const permissionsRepository = getCustomRepository(PermissionsRepository)

    const user = await permissionsRepository.findOne({
        userId: id
    })

    if(!user) {
        return response.status(401).json({
            error: "User not valid"
        })
    }
    
    if(user.localAdm || user.generalAdm) {
        return next()
    }
    
    return response.status(401).json({
        error: "Not authorized"
    })
}

export const systemUserMiddleware = async (request, response: Response, next) => {
    const id = request.tokenPayload.id
    const type = request.tokenPayload.type

    if (type === "systemUser") {
        const systemUserRepository = getCustomRepository(SystemUserRepository)
        const isValidId = await systemUserRepository.findOne({
            id: id
        })
        if(isValidId) {
            return next()
        }
        return response.status(401).json({
            error: "Not a system user"
        })
    } else {
        return response.status(401).json({
            error: "Not authorized"
        })
    }
}

export const usmUserMiddleware = async (request, response: Response, next) => {
    const id = request.tokenPayload.id
    const type = request.tokenPayload.type

    if (type === "systemUser") {
        const systemUserRepository = getCustomRepository(SystemUserRepository)
        const isValidId = await systemUserRepository.findOne({
            id: id
        })

        if(!isValidId) {
            return response.status(401).json({
                error: "User not valid"
            })
        } else {
            if(isValidId.department === "USM") {
                return next()
            }
            else {
                return response.status(401).json({
                    error: "Not authorized"
                })
            }
        }
  
    } else {
        return response.status(401).json({
            error: "Not authorized"
        })
    }
}