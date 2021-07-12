import { AppError } from "./AppError";

export class PatientAlreadyExistsError extends AppError{
    
    constructor(){
        const message = "Paciente já cadastrado no sistema"
        const statusCode = 400
        super(message, statusCode);
    }
} 