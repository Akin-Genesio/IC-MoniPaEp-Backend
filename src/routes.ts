import { Router } from "express";
import { 
  DiseaseController, 
  FAQSuggestionsController, 
  HealthProtocolController, 
  USMController, 
  VaccineController
} from "./controllers";
import { AppointmentController } from "./controllers/AppointmentController";
import { AssignedHealthProtocolController } from "./controllers/AssignedHealthProtocolController";
import { DiseaseOccurrenceController } from "./controllers/DiseaseOccurrenceController";
import { FAQController } from "./controllers/FAQController";
import { PatientController } from "./controllers/PatientController";
import { PatientMovementHistoryController } from "./controllers/PatientMovementHistoryController";
import { PermissionsController } from "./controllers/PermissionsController";
import { RefreshTokenController } from "./controllers/RefreshTokenController";
import { SymptomController } from "./controllers/SymptomController";
import { SymptomOccurrenceController } from "./controllers/SymptomOccurrenceController";
import { SystemUserController } from "./controllers/SystemUserController";
import * as jwt from "./jwt"

const router = Router()

const patientController = new PatientController();
const faqController = new FAQController()
const usmController = new USMController()
const diseaseController = new DiseaseController()
const healthProtocolController = new HealthProtocolController()
const assignedHealthProtocolController = new AssignedHealthProtocolController()
const symptomController = new SymptomController()
const diseaseOccurrenceController = new DiseaseOccurrenceController()
const symptomOccurrenceController = new SymptomOccurrenceController()
const patientMovementHistoryController = new PatientMovementHistoryController()
const systemUserController = new SystemUserController()
const permissionsController = new PermissionsController()
const faqSuggestionsController = new FAQSuggestionsController()
const refreshTokenController = new RefreshTokenController()
//const appointmentController = new AppointmentController()
//const vaccineController = new VaccineController()

//Refresh Token Routes

router.post("/refreshtoken", refreshTokenController.create)

//Permissions Routes

router.post("/permissions", jwt.authMiddleware, jwt.localAdminMiddleware, permissionsController.create)
router.get("/permissions", jwt.authMiddleware, jwt.localAdminMiddleware, permissionsController.list)
router.put("/permissions/:id", jwt.authMiddleware, jwt.localAdminMiddleware, permissionsController.alterOne)
router.delete("/permissions/:id", jwt.authMiddleware, jwt.localAdminMiddleware, permissionsController.deleteOne)

//SystemUser Routes

router.post("/systemuser/signup", systemUserController.create) //geral *login ira verificar se esta autorizado
router.get("/systemuser/login", systemUserController.login)//geral
router.get("/systemuser", jwt.authMiddleware, jwt.systemUserMiddleware, systemUserController.list)//funcionario autenticado*
router.get("/systemuser/me", jwt.authMiddleware, jwt.systemUserMiddleware, systemUserController.getOneWithToken)//funcionario autenticado
router.put("/systemuser/:id", jwt.authMiddleware, jwt.systemUserMiddleware, systemUserController.alterOne)//funcionario autenticado*
router.put("/systemuser/password/:id", jwt.authMiddleware, jwt.systemUserMiddleware, systemUserController.updatePassword)//funcionario autenticado*
router.delete("/systemuser/:id", jwt.authMiddleware, jwt.localAdminMiddleware, systemUserController.deleteOne)//adm e adm local

//Patient Routes
router.post("/patients/signup", patientController.create) //geral
router.post("/patients/login", patientController.loginPost) //geral
router.get("/patients", jwt.authMiddleware, jwt.systemUserMiddleware, patientController.list) //funcionarios autenticados
router.get("/patients/me", jwt.authMiddleware, patientController.getOneWithToken) //geral autenticado*
router.put("/patients/:id", jwt.authMiddleware, patientController.alterOne) //geral autenticado*
router.put("/patients/deactivate/:id", jwt.authMiddleware, patientController.deactivateAccount) //geral autenticado*
router.delete("/patients/:id", jwt.authMiddleware, jwt.adminMiddleware, patientController.deleteOne) //funcionarios autenticados

//USM Routes
router.post("/usm", jwt.authMiddleware, jwt.adminMiddleware, usmController.create)//adm e adm local
router.get("/usm", usmController.list)//geral sem autenticacao
router.put("/usm/:name", jwt.authMiddleware, jwt.adminMiddleware, usmController.alterOne)//adm e adm local
router.delete("/usm/:name", jwt.authMiddleware, jwt.adminMiddleware, usmController.deleteOne)//adm e adm local

//Disease Routes
router.post("/disease", jwt.authMiddleware, jwt.localAdminMiddleware, diseaseController.create)//adm e adm locais
router.get("/disease", diseaseController.list)//geral sem autenticacao
router.put("/disease/:name", jwt.authMiddleware, jwt.localAdminMiddleware, diseaseController.alterOne)///adm e adm locais
router.delete("/disease/:name", jwt.authMiddleware, jwt.localAdminMiddleware, diseaseController.deleteOne)//adm e adm locais

//Health Protocol Routes
router.post("/healthprotocol", jwt.authMiddleware, jwt.usmUserMiddleware, healthProtocolController.create)//usuarios do USM*
router.get("/healthprotocol", jwt.authMiddleware, healthProtocolController.list)//geral autenticado
router.put("/healthprotocol/:id", jwt.authMiddleware, jwt.usmUserMiddleware, healthProtocolController.alterOne)//funcionarios USM*
router.delete("/healthprotocol/:id", jwt.authMiddleware, jwt.usmUserMiddleware, healthProtocolController.deleteOne)//funcionarios USM*

//Symptom Routes
router.post("/symptom", jwt.authMiddleware, jwt.localAdminMiddleware, symptomController.create)//adm e adm locais
router.get("/symptom", symptomController.list)//geral
router.put("/symptom/:symptom", jwt.authMiddleware, jwt.localAdminMiddleware, symptomController.alterOne)//adm e adm locais
router.delete("/symptom/:symptom", jwt.authMiddleware, jwt.localAdminMiddleware, symptomController.deleteOne)//adm e adm locais

//DiseaseOccurrence Routes
router.post("/diseaseoccurrence", jwt.authMiddleware, jwt.systemUserMiddleware, diseaseOccurrenceController.create)//geral autenticado*
router.get("/diseaseoccurrence", jwt.authMiddleware, diseaseOccurrenceController.list)//geral autenticado
router.get("/diseaseoccurrence/:id", jwt.authMiddleware, diseaseOccurrenceController.listDiseaseDetails)//geral autenticado
router.put("/diseaseoccurrence/:id", jwt.authMiddleware, jwt.systemUserMiddleware, diseaseOccurrenceController.alterOne)//geral autenticado*
router.delete("/diseaseoccurrence/:id", jwt.authMiddleware, jwt.systemUserMiddleware, diseaseOccurrenceController.deleteOne)//geral autenticado*

//SymptomOccurrence Routes
router.post("/symptomoccurrence", jwt.authMiddleware, symptomOccurrenceController.create)//geral autenticado*
router.post("/symptomoccurrenceSeveral",jwt.authMiddleware, symptomOccurrenceController.createSeveral)//geral autenticado*
router.get("/symptomoccurrence", jwt.authMiddleware, symptomOccurrenceController.list)//geral autenticado
router.post("/symptomoccurrence/listOcurrences", jwt.authMiddleware, symptomOccurrenceController.listOccurences)//geral autenticado
router.get("/symptomoccurrence/unassigned", jwt.authMiddleware, symptomOccurrenceController.getUnassignedOccurrences)//geral autenticado
router.put("/symptomoccurrence/:id", jwt.authMiddleware, symptomOccurrenceController.alterOne)//geral autenticado*
router.delete("/symptomoccurrence/:id", jwt.authMiddleware, symptomOccurrenceController.deleteOne)//geral autenticado*

//AssignedHealthProtocol Routes
router.post("/assignedhealthprotocol", jwt.authMiddleware, jwt.systemUserMiddleware, assignedHealthProtocolController.create)//usuario do sistema autenticado
router.get("/assignedhealthprotocol", jwt.authMiddleware, assignedHealthProtocolController.list)//geral autenticado
router.delete("/assignedhealthprotocol/:disease_name/:healthprotocol_id", jwt.authMiddleware, jwt.systemUserMiddleware, assignedHealthProtocolController.deleteOne)//usuario do sistema autenticado

//PatientMovementHistory Routes
router.post("/patientmovementhistory", jwt.authMiddleware, patientMovementHistoryController.create) //geral autenticado*
router.get("/patientmovementhistory", jwt.authMiddleware, patientMovementHistoryController.list) //geral autenticado
router.put("/patientmovementhistory/:id", jwt.authMiddleware, patientMovementHistoryController.alterOne) //geral autenticado*
router.delete("/patientmovementhistory/:id", jwt.authMiddleware, patientMovementHistoryController.deleteOne) //geral autenticado*

//FAQ Routes
router.post("/faq", jwt.authMiddleware, jwt.systemUserMiddleware, faqController.create)//usuario de sistema autenticado
router.get("/faq", faqController.list)//geral
router.put("/faq/:id", jwt.authMiddleware, jwt.systemUserMiddleware, faqController.alterOne)//usuario de sistema autenticado
router.delete("/faq/:id", jwt.authMiddleware, jwt.systemUserMiddleware, faqController.deleteOne)//usuario de sistema autenticado

//FAQ Suggestions Routes

router.post("/faqsuggestions", faqSuggestionsController.create)
router.get("/faqsuggestions", faqSuggestionsController.list)
router.delete("/faqsuggestions/:id", jwt.authMiddleware, jwt.systemUserMiddleware, faqSuggestionsController.deleteOne)

//Appointments Routes - TBD
// router.post("/appointments", appointmentController.create)//funcionarios USM

//Vaccine Routes
// router.post("/vaccine", jwt.authMiddleware, vaccineController.create)//geral autenticado*
// router.get("/vaccine", jwt.authMiddleware, vaccineController.list)//geral autenticado
// router.get("/vaccine/:vaccine_id", jwt.authMiddleware, vaccineController.getOne)//geral autenticado
// router.put("/vaccine/:vaccine_id", jwt.authMiddleware, vaccineController.alterOne)//geral autenticado*
// router.delete("/vaccine/:vaccine_id", jwt.authMiddleware, vaccineController.deleteOne)//geral autenticado*

export { router }
