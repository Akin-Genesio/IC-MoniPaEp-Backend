import { Router } from "express";
import { DiseaseController, HealthProtocolController, USMController, VaccineController } from "./controllers";
import { AppointmentController } from "./controllers/AppointmentController";
import { AssignedHealthProtocolController } from "./controllers/AssignedHealthProtocolController";
import { DiseaseOccurrenceController } from "./controllers/DiseaseOccurrenceController";
import { FAQController } from "./controllers/FAQController";
import { PatientController } from "./controllers/PatientController";
import { PatientMovementHistoryController } from "./controllers/PatientMovementHistoryController";
import { SymptomController } from "./controllers/SymptomController";
import { SymptomOccurrenceController } from "./controllers/SymptomOccurrenceController";
import { SystemUserController } from "./controllers/SystemUserController";
import * as jwt from "./jwt"

const router = Router()

const patientController = new PatientController();
const faqController = new FAQController()
const appointmentController = new AppointmentController()
const usmController = new USMController()
const vaccineController = new VaccineController()
const diseaseController = new DiseaseController()
const healthProtocolController = new HealthProtocolController()
const assignedHealthProtocolController = new AssignedHealthProtocolController()
const symptomController = new SymptomController()
const diseaseOccurrenceController = new DiseaseOccurrenceController()
const symptomOccurrenceController = new SymptomOccurrenceController()
const patientMovementHistoryController = new PatientMovementHistoryController()
const systemUserController = new SystemUserController()

//Appointments Routes - TBD
router.post("/appointments", appointmentController.create)//funcionarios USM

//Permissions Routes - TBD
//Suggestions FAQ/Symptom - TBD



//SystemUser Routes - getOne

router.post("/systemuser/signup", systemUserController.create) //adm e adm local
router.get("/systemuser/login", systemUserController.login)//geral
router.get("/systemuser/userdata", jwt.authMiddleware, jwt.systemUserMiddleware, systemUserController.getOneWithToken)//funcionario autenticado*
router.get("/systemuser", jwt.authMiddleware, jwt.localAdminMiddleware, systemUserController.list)//adm e adm local
router.get("/systemuser/:user_id", jwt.authMiddleware, jwt.systemUserMiddleware, systemUserController.getOne)//funcionario autenticado*
router.put("/systemuser/:user_id", jwt.authMiddleware, jwt.systemUserMiddleware, systemUserController.alterOne)//funcionario autenticado*
router.delete("/systemuser/:user_id", jwt.authMiddleware, jwt.localAdminMiddleware, systemUserController.deleteOne)//adm e adm local

//Patient Routes - alterar o post pra gerar o token e criar login
router.post("/patients/signup", patientController.create) //geral
router.get("/patients/login", patientController.login) //geral
router.get("/patients", jwt.authMiddleware, jwt.systemUserMiddleware, patientController.list) //funcionarios autenticados
router.get("/patients/:patient_id", jwt.authMiddleware, patientController.getOne) //geral autenticado*
router.put("/patients/:patient_id", jwt.authMiddleware, patientController.alterOne) //geral autenticado*
router.delete("/patients/:patient_id", jwt.authMiddleware, patientController.deleteOne) //geral autenticado*

//USM Routes - Ok
router.post("/usm", jwt.authMiddleware, jwt.localAdminMiddleware, usmController.create)//adm e adm local
router.get("/usm", usmController.list)//geral sem autenticacao
router.get("/usm/:usm_name", usmController.getOne)//geral sem autenticacao
router.put("/usm/:usm_name", jwt.authMiddleware, jwt.localAdminMiddleware, usmController.alterOne)//adm e adm local
router.delete("/usm/:usm_name", jwt.authMiddleware, jwt.localAdminMiddleware, usmController.deleteOne)//adm e adm local

//Disease Routes - Ok
router.post("/disease", jwt.authMiddleware, jwt.localAdminMiddleware, diseaseController.create)//adm e adm locais
router.get("/disease", diseaseController.list)//geral sem autenticacao
router.get("/disease/:disease_name", diseaseController.getOne)//geral sem autenticacao
router.put("/disease/:disease_name", jwt.authMiddleware, jwt.localAdminMiddleware, diseaseController.alterOne)///adm e adm locais
router.delete("/disease/:disease_name", jwt.authMiddleware, jwt.localAdminMiddleware, diseaseController.deleteOne)//adm e adm locais

//Vaccine Routes - Ok
router.post("/vaccine", jwt.authMiddleware, vaccineController.create)//geral autenticado*
router.get("/vaccine", jwt.authMiddleware, vaccineController.list)//geral autenticado
router.get("/vaccine/:vaccine_id", jwt.authMiddleware, vaccineController.getOne)//geral autenticado
router.put("/vaccine/:vaccine_id", jwt.authMiddleware, vaccineController.alterOne)//geral autenticado*
router.delete("/vaccine/:vaccine_id", jwt.authMiddleware, vaccineController.deleteOne)//geral autenticado*

//Health Protocol Routes - Ok
router.post("/healthprotocol", jwt.authMiddleware, jwt.usmUserMiddleware, healthProtocolController.create)//usuarios do USM*
router.get("/healthprotocol", jwt.authMiddleware, healthProtocolController.list)//geral autenticado
router.get("/healthprotocol/:description", jwt.authMiddleware, healthProtocolController.getOne)//geral autenticado
router.put("/healthprotocol/:description", jwt.authMiddleware, jwt.usmUserMiddleware, healthProtocolController.alterOne)//funcionarios USM*
router.delete("/healthprotocol/:description", jwt.authMiddleware, jwt.usmUserMiddleware, healthProtocolController.deleteOne)//funcionarios USM*

//Symptom Routes - Ok
router.post("/symptom", jwt.authMiddleware, jwt.localAdminMiddleware, symptomController.create)//adm e adm locais
router.get("/symptom", symptomController.list)//geral
router.put("/symptom/:symptom_name", jwt.authMiddleware, jwt.localAdminMiddleware, symptomController.alterOne)//adm e adm locais
router.delete("/symptom/:symptom_name", jwt.authMiddleware, jwt.localAdminMiddleware, symptomController.deleteOne)//adm e adm locais

//DiseaseOccurrence Routes - Ok
router.post("/diseaseoccurrence", jwt.authMiddleware, diseaseOccurrenceController.create)//geral autenticado*
router.get("/diseaseoccurrence", jwt.authMiddleware, diseaseOccurrenceController.list)//geral autenticado
router.get("/diseaseoccurrence/:id", jwt.authMiddleware, diseaseOccurrenceController.getOne)//geral autenticado
router.put("/diseaseoccurrence/:id", jwt.authMiddleware, diseaseOccurrenceController.alterOne)//geral autenticado*
router.delete("/diseaseoccurrence/:id", jwt.authMiddleware, diseaseOccurrenceController.deleteOne)//geral autenticado*

//SymptomOccurrence Routes - Ok
router.post("/symptomoccurrence", jwt.authMiddleware, symptomOccurrenceController.create)//geral autenticado*
router.get("/symptomoccurrence", jwt.authMiddleware, symptomOccurrenceController.list)//geral autenticado
router.put("/symptomoccurrence/:disease_occurrence_id/:symptom_name", jwt.authMiddleware, symptomOccurrenceController.alterOne)//geral autenticado*
router.delete("/symptomoccurrence/:disease_occurrence_id/:symptom_name", jwt.authMiddleware, symptomOccurrenceController.deleteOne)//geral autenticado*

//AssignedHealthProtocol Routes - Ok
router.post("/assignedhealthprotocol", jwt.authMiddleware, jwt.systemUserMiddleware, assignedHealthProtocolController.create)//usuario do sistema autenticado
router.get("/assignedhealthprotocol", jwt.authMiddleware, assignedHealthProtocolController.list)//geral autenticado
router.delete("/assignedhealthprotocol/:disease_name/:healthprotocol_description", jwt.authMiddleware, jwt.systemUserMiddleware, assignedHealthProtocolController.deleteOne)//usuario do sistema autenticado

//PatientMovementHistory Routes
router.post("/patientmovementhistory", jwt.authMiddleware, patientMovementHistoryController.create) //geral autenticado*
router.get("/patientmovementhistory", jwt.authMiddleware, patientMovementHistoryController.list) //geral autenticado
router.put("/patientmovementhistory/:disease_occurrence_id/:description", jwt.authMiddleware, patientMovementHistoryController.alterOne) //geral autenticado*
router.delete("/patientmovementhistory/:disease_occurrence_id/:description", jwt.authMiddleware, patientMovementHistoryController.deleteOne) //geral autenticado*

//FAQ Routes - Ok
router.post("/faq", jwt.authMiddleware, jwt.localAdminMiddleware, faqController.create)//adm e adm local
router.get("/faq", faqController.list)//geral
router.put("/faq/:question", jwt.authMiddleware, jwt.localAdminMiddleware, faqController.alterOne)//adm e adm local
router.delete("/faq/:question", jwt.authMiddleware, jwt.localAdminMiddleware, faqController.deleteOne)//adm e adm local


export { router };
