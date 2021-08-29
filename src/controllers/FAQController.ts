import { Request, Response } from "express";
import { getCustomRepository } from 'typeorm'
import { FAQ } from "../models";
import { FAQRepository } from "../repositories/FAQRepository";

class FAQController{
  async create(request: Request, response: Response){
    const body = request.body
    
    const faqRepository = getCustomRepository(FAQRepository)

    const faqAlreadyExists = await faqRepository.findOne({
      question: body.question
    })

    if(faqAlreadyExists){
      return response.status(403).json({
        error: "Essa questão já foi registrada"
      })
    }

    try {
      const faqBody = faqRepository.create(body)
      const faq: any = await faqRepository.save(faqBody)
  
      return response.status(201).json({
        success: "Questão registrada com sucesso",
        faq
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro no registro da questão"
      })
    }
  }

  async list(request: Request, response: Response) {
    const { question, id } = request.query

    const faqRepository = getCustomRepository(FAQRepository)
    let filters = {}

    if(id) {
      filters = { ...filters, id: String(id) }

      const questionExists = await faqRepository.findOne({
        id: String(id)
      })

      if(!questionExists) {
        return response.status(404).json({
          error: "Questão não encontrada"
        })
      }
    }

    if(question) {
      filters = { ...filters, question: String(question) }
      
      const questionExists = await faqRepository.findOne({
        question: String(question)
      })

      if(!questionExists) {
        return response.status(404).json({
          error: "Questão não encontrada"
        })
      }
    }

    const questionsList = await faqRepository.find(filters)
  
    return response.status(200).json(questionsList)
  }

  async alterOne(request: Request, response: Response) {
    const body = request.body
    const { id } = request.params

    const faqRepository = getCustomRepository(FAQRepository)

    const questionExists = await faqRepository.findOne({ id })

    if(!questionExists) {
      return response.status(404).json({
        error: "Questão não encontrada"
      })
    }

    try {
      await faqRepository.createQueryBuilder()
        .update(FAQ)
        .set(body)
        .where("id = :id", { id })
        .execute()
      return response.status(200).json({
        success: "Questão atualizada com sucesso",
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na alteração da questão"
      })
    }
  }

  async deleteOne(request: Request, response: Response) {
    const { id } = request.params

    const faqRepository = getCustomRepository(FAQRepository)

    const questionExists = await faqRepository.findOne({ id })

    if(!questionExists) {
      return response.status(404).json({
        error: "Questão não encontrada"
      })
    }
    
    try {
      await faqRepository.createQueryBuilder()
        .delete()
        .from(FAQ)
        .where("id = :id", { id })
        .execute()
      return response.status(200).json({
        success: "Questão deletada com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na deleção da questão"
      })
    }
  }
}

export { FAQController };