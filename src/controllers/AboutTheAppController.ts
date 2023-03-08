import { Request, Response } from "express";
import { getCustomRepository, Like } from 'typeorm'
import { AboutTheApp } from "../models";
import { AboutTheAppsRepository } from "../repositories";

class AboutTheAppController{
  async create(request: Request, response: Response){
    const body = request.body
    
    const AboutTheAppRepository = getCustomRepository(AboutTheAppsRepository)

    const AboutTheAppAlreadyExists = await AboutTheAppRepository.findOne({
      main: body.main
    })

    if(AboutTheAppAlreadyExists){
      return response.status(403).json({
        error: "Essa informação já foi registrada"
      })
    }

    try {
      const AboutTheAppBody = AboutTheAppRepository.create(body)
      const about: any = await AboutTheAppRepository.save(AboutTheAppBody)
  
      return response.status(201).json({
        success: "Informação registrada com sucesso",
        about
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro no registro da informação"
      })
    }
  }

  async list(request: Request, response: Response) {
    const { main, id } = request.query

    const AboutTheAppRepository = getCustomRepository(AboutTheAppsRepository)
    let filters = {}

    if(id) {
      const mainExists = await AboutTheAppRepository.findOne({
        id: String(id)
      })

      if(!mainExists) {
        return response.status(404).json({
          error: "Informação não encontrada"
        })
      }

      filters = { ...filters, id: String(id) }
    }

    if(main) {
      filters = { ...filters, main: Like(`%${String(main)}%`) }
    }

    const mainsList = await AboutTheAppRepository.findAndCount({
      where: filters,
      order: {
        main: "ASC"
      }
    })
  
    return response.status(200).json({
      AboutTheApps: mainsList[0],
      totalAboutTheApps: mainsList[1],
    })
  }

  async alterOne(request: Request, response: Response) {
    const body = request.body
    const { id } = request.params

    const AboutTheAppRepository = getCustomRepository(AboutTheAppsRepository)

    const mainExists = await AboutTheAppRepository.findOne({ id })

    if(!mainExists) {
      return response.status(404).json({
        error: "Informação não encontrada"
      })
    }

    try {
      await AboutTheAppRepository.createQueryBuilder()
        .update(AboutTheApp)
        .set(body)
        .where("id = :id", { id })
        .execute()
      return response.status(200).json({
        success: "Informação atualizada com sucesso",
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na alteração da Informação"
      })
    }
  }

  async deleteOne(request: Request, response: Response) {
    const { id } = request.params

    const AboutTheAppRepository = getCustomRepository(AboutTheAppsRepository)

    const questionExists = await AboutTheAppRepository.findOne({ id })

    if(!questionExists) {
      return response.status(404).json({
        error: "Informação não encontrada"
      })
    }
    
    try {
      await AboutTheAppRepository.createQueryBuilder()
        .delete()
        .from(AboutTheApp)
        .where("id = :id", { id })
        .execute()
      return response.status(200).json({
        success: "Informação deletada com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na deleção da Informação"
      })
    }
  }
}

export { AboutTheAppController };