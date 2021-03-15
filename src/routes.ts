import {Router} from "express"
import { PatientController } from "./controllers/PatientController";

const router = Router()

const patientController = new PatientController();

router.post("/patients", patientController.create)
export {router}