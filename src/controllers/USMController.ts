import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { USM } from "../models";
import { USMRepository } from "../repositories";
class USMController{
  async create(request: Request, response: Response){
    const body = request.body

    const usmRepository = getCustomRepository(USMRepository)

    const usmAlreadyExists =  await usmRepository.findOne({
      name: body.name
    })

    if(usmAlreadyExists){
      return response.status(400).json({
        error: "Unidade de saúde já registrada"
      })
    }

    try {
      const usm = usmRepository.create(body)
      await usmRepository.save(usm)
      
      return response.status(201).json({
        success: "Unidade de saúde cadastrada com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro no cadastro da unidade de saúde"
      })
    }
  }

  async list(request: Request, response: Response){
    const { name, page } = request.query
    let filters = {}

    if(name) {
      filters = { ...filters, name: String(name) }
    }

    let options: any = {
      where: filters,
      order: {
        name: 'ASC'
      },
    }

    if(page) {
      const take = 10
      options = { ...options, take, skip: ((Number(page) - 1) * take) }
    }

    const usmRepository = getCustomRepository(USMRepository)
    const usmList = await usmRepository.findAndCount(options)

    return response.status(200).json({
      usms: usmList[0],
      totalUsms: usmList[1]
    })
  }

  async alterOne(request: Request, response: Response){
    const body = request.body
    const { name } = request.params

    const usmRepository = getCustomRepository(USMRepository)

    const isValidUsm = await usmRepository.findOne({ name })
    
    if(!isValidUsm){
      return response.status(404).json({
        error: "Unidade de saúde não encontrada"
      })
    }

    try {
      await usmRepository.createQueryBuilder()
        .update(USM)
        .set(body)
        .where("name = :name", { name })
        .execute();
      return response.status(200).json({
        success: "Unidade de saúde alterada com sucesso",
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na atualização da unidade de saúde"
      })
    }
  }

  async deleteOne(request: Request, response: Response){
    const { name } = request.params

    const usmRepository = getCustomRepository(USMRepository)

    const isValidUsm = await usmRepository.findOne({ name })
    
    if(!isValidUsm){
      return response.status(404).json({
        error: "Unidade de saúde não encontrada"
      })
    }
    
    try {
      await usmRepository.createQueryBuilder()
        .delete()
        .from(USM)
        .where("name = :name", { name })
        .execute();
      return response.status(200).json({
        success: "Unidade de saúde deletada com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na deleção da unidade de saúde"
      })
    }
  }
}

export { USMController }