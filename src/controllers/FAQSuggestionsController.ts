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
      return response.status(406).json({
        error: "This question has already been suggested!"
      })
    }

    try {
      const faq = faqSuggestionsRepository.create(body)
      await faqSuggestionsRepository.save(faq)
  
      return response.status(201).json(faq)
    } catch (error) {
      return response.status(403).json({
        error: error.message
      })
    }
  }
  
  async list(request: Request, response: Response) {
    const {question} = request.query

    const faqSuggestionsRepository = getCustomRepository(FAQSuggestionsRepository)

    if(question) {
      const questionExists = await faqSuggestionsRepository.findOne({
        question: String(question)
      })

      if(!questionExists) {
        return response.status(404).json({
          error: "Question not found"
        })
      }

      return response.status(200).json(questionExists)
    } else {
      const questionsList = await faqSuggestionsRepository.find()
      return response.status(200).json(questionsList)
    }
  }

  async deleteOne(request: Request, response: Response) {
    const {question} = request.params

    const faqSuggestionsRepository = getCustomRepository(FAQSuggestionsRepository)

    const questionExists = await faqSuggestionsRepository.findOne({
      question: question
    })

    if(!questionExists) {
      return response.status(404).json({
        error: "Question not found"
      })
    }
    
    try {
      await faqSuggestionsRepository.createQueryBuilder()
        .delete()
        .from(FAQSuggestions)
        .where("question = :question", {question: question})
        .execute()
      return response.status(200).json({
        message: "Question has been deleted"
      })
    } catch (error) {
      return response.status(403).json({
        error: error
      })
    }
  }
}

export { FAQSuggestionsController }