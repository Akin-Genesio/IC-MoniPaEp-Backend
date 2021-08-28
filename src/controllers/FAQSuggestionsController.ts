import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { FAQSuggestions } from "../models"
import { FAQSuggestionsRepository } from "../repositories"

class FAQSuggestionsController {
  async create(request: Request, response: Response){
    const body = request.body
    
    const faqSuggestionsRepository = getCustomRepository(FAQSuggestionsRepository)

    const faqSuggestedExists = await faqSuggestionsRepository.findOne({
      question: body.question
    })

    if(faqSuggestedExists){
      return response.status(403).json({
        error: "Essa sugestão de questão já foi registrada"
      })
    }

    try {
      const faqBody = faqSuggestionsRepository.create(body)
      const faq: any = await faqSuggestionsRepository.save(faqBody)
  
      return response.status(201).json({
        success: "Sugestão de questão registrada com sucesso",
        faq
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro no registro da sugestão de questão"
      })
    }
  }
  
  async list(request: Request, response: Response) {
    const { question, id } = request.query

    const faqSuggestionsRepository = getCustomRepository(FAQSuggestionsRepository)
    let filters = {}

    if(id) {
      filters = { ...filters, id: String(id) }
    }

    if(question) {
      filters = { ...filters, question: String(question) }
    }

    const hasQueryParams = Object.keys(filters).length

    if(!hasQueryParams) {
      const questionsList = await faqSuggestionsRepository.find()

      return response.status(200).json(questionsList)
    } else {
      if(question) {
        const questionExists = await faqSuggestionsRepository.findOne({
          question: String(question)
        })
  
        if(!questionExists) {
          return response.status(404).json({
            error: "Sugestão de questão não encontrada"
          })
        }
      } 

      if(id) {
        const questionExists = await faqSuggestionsRepository.findOne({
          id: String(id)
        })
  
        if(!questionExists) {
          return response.status(404).json({
            error: "Sugestão de questão não encontrada"
          })
        }
      } 
      const questionsList = await faqSuggestionsRepository.find(filters)

      return response.status(200).json(questionsList)
    }
  }

  async deleteOne(request: Request, response: Response) {
    const { id } = request.params

    const faqSuggestionsRepository = getCustomRepository(FAQSuggestionsRepository)

    const questionExists = await faqSuggestionsRepository.findOne({ id })

    if(!questionExists) {
      return response.status(404).json({
        error: "Sugestão de questão não encontrada"
      })
    }
    
    try {
      await faqSuggestionsRepository.createQueryBuilder()
        .delete()
        .from(FAQSuggestions)
        .where("id = :id", { id })
        .execute()
      return response.status(200).json({
        message: "Sugestão de questão deletada com sucesso"
      })
    } catch (error) {
      return response.status(403).json({
        error: "Erro na deleção da sugestão de questão"
      })
    }
  }
}

export { FAQSuggestionsController }