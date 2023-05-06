import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'
import { scheduleJob } from 'node-schedule'
import createConnection from './database'
import { router } from './routes';
import { AppError } from './errors';
import { verifyOccurrencesExpiration } from './scheduledJobs';
import 'reflect-metadata'
import 'express-async-errors'

const app = express();
createConnection()
app.use(cors())
app.use(express.json())
app.use(router);

scheduleJob('0 1 * * *', verifyOccurrencesExpiration)

//Errors  treatment
app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
  if(err instanceof AppError){
    return response.status(err.statusCode).json({
      message: err.message,
    })
  }

  return response.status(500).json({
    status: "Error",
    message: err.message
  })
})

export { app }