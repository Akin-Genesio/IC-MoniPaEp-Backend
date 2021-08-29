import { Response } from 'express'
import { getCustomRepository } from 'typeorm'
import jwt from 'jsonwebtoken'

import { PermissionsRepository, SystemUserRepository } from './repositories'

type TokenPayload = {
  id: string;
  type: string;
} 

const secret = 'wLbITYtzyd0hOOOPVQGRPnQh84RRY3KPiybKYwhzin8TCejiBgJoos22RBrxiWU'

export const sign = (payload: TokenPayload) => jwt.sign(payload, secret, { expiresIn: 60 * 60 * 24 })
export const verify = (token: string) => jwt.verify(token, secret)

export const authMiddleware = async (request, response: Response, next) => {
  let token
  if (request.headers.authorization) {
    [, token] = request.headers.authorization.split(' ')
  } else {
    return response.status(401).json({
      error: "Token não encontrado",
      code: "token.not.found"
    })
  }
  
  try {
    const payload: any =  verify(token)
    request.tokenPayload = payload
    return next()
  } catch (error) {
    if(error.message === "jwt expired") {
      return response.status(401).json({
        error: "Token expirado",
        code: "token.expired"
      })
    } else {
      return response.status(401).json({
        error: "Token inválido e/ou expirado",
        code: "token.invalid"
      })
    }
  }
}

export const adminMiddleware = async (request, response: Response, next) => {
  const id = request.tokenPayload.id
  const type = request.tokenPayload.type

  if (type !== "system_user") {
    return response.status(401).json({
      error: "Usuário inválido para essa requisição",
      code: "not.system.user"
    })
  }
  
  const permissionsRepository = getCustomRepository(PermissionsRepository)

  const user = await permissionsRepository.findOne({
    userId: id
  })

  if(!user) {
    return response.status(401).json({
      error: "Usuário não encontrado",
      code: "invalid.system.user"
    })
  }
  
  if(user.generalAdm) {
    return next()
  }
  
  return response.status(401).json({
    error: "Usuário sem as permissões necessárias para essa requisição",
    code: "not.admin"
  })
}

export const localAdminMiddleware = async (request, response: Response, next) => {
  const id = request.tokenPayload.id
  const type = request.tokenPayload.type

  if (type !== "system_user") {
    return response.status(401).json({
      error: "Usuário inválido para essa requisição",
      code: "not.system.user"
    })
  }
  
  const permissionsRepository = getCustomRepository(PermissionsRepository)

  const user = await permissionsRepository.findOne({
    userId: id
  })

  if(!user) {
    return response.status(401).json({
      error: "Usuário não encontrado",
      code: "invalid.system.user"
    })
  }
  
  if(user.localAdm || user.generalAdm) {
    return next()
  }
  
  return response.status(401).json({
    error: "Usuário sem as permissões necessárias para essa requisição",
    code: "not.local.admin"
  })
}

export const systemUserMiddleware = async (request, response: Response, next) => {
  const { id, type } = request.tokenPayload

  if (type === "system_user") {
    const systemUserRepository = getCustomRepository(SystemUserRepository)
    const isValidId = await systemUserRepository.findOne({ id })
    if(isValidId) {
      return next()
    }
    return response.status(401).json({
      error: "Usuário não encontrado",
      code: "invalid.system.user"
    })
  } else {
    return response.status(401).json({
      error: "Usuário inválido para essa requisição",
      code: "not.system.user"
    })
  }
}

export const usmUserMiddleware = async (request, response: Response, next) => {
  const { id, type } = request.tokenPayload

  if (type === "system_user") {
    const systemUserRepository = getCustomRepository(SystemUserRepository)
    const isValidId = await systemUserRepository.findOne({ id })

    if(!isValidId) {
      return response.status(401).json({
        error: "Usuário não encontrado",
        code: "invalid.system.user"
      })
    } else {
      if(isValidId.department === "USM") {
        return next()
      } else {
        return response.status(401).json({
          error: "Usuário inválido para essa requisição",
          code: "not.usm.user"
        })
      }
    }
  } else {
    return response.status(401).json({
      error: "Usuário inválido para essa requisição",
      code: "not.system.user"
    })
  }
}