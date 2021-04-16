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

//Patient Routes
router.post("/patients", patientController.create)
router.get("/patients", patientController.list)
router.get("/patients/:patient_id", patientController.getOne)
router.put("/patients/:patient_id", patientController.alterOne)
router.delete("/patients/:patient_id", patientController.deleteOne)

//USM Routes
router.post("/usm", usmController.create)
router.get("/usm", usmController.list)
router.get("/usm/:usm_name", usmController.getOne)
router.put("/usm/:usm_name", usmController.alterOne)
router.delete("/usm/:usm_name", usmController.deleteOne)

//Disease Routes
router.post("/disease", diseaseController.create)
router.get("/disease", diseaseController.list)
router.get("/disease/:disease_name", diseaseController.getOne)
router.put("/disease/:disease_name", diseaseController.alterOne)
router.delete("/disease/:disease_name", diseaseController.deleteOne)

//Vaccine Routes
router.post("/vaccine", vaccineController.create)
router.get("/vaccine", vaccineController.list)
router.get("/vaccine/:vaccine_id", vaccineController.getOne)
router.put("/vaccine/:vaccine_id", vaccineController.alterOne)
router.delete("/vaccine/:vaccine_id", vaccineController.deleteOne)

//Health Protocol Routes
router.post("/healthprotocol", healthProtocolController.create)
router.get("/healthprotocol", healthProtocolController.list)
router.get("/healthprotocol/:description", healthProtocolController.getOne)
router.put("/healthprotocol/:description", healthProtocolController.alterOne)
router.delete("/healthprotocol/:description", healthProtocolController.deleteOne)

//Appointments Routes
router.post("/appointments", appointmentController.create)

//Symptom Routes
router.post("/symptom", symptomController.create)
router.get("/symptom", symptomController.list)
router.put("/symptom/:symptom_name", symptomController.alterOne)
router.delete("/symptom/:symptom_name", symptomController.deleteOne)

//DiseaseOccurrence Routes
router.post("/diseaseoccurrence", diseaseOccurrenceController.create)
router.get("/diseaseoccurrence", diseaseOccurrenceController.list)
router.get("/diseaseoccurrence/:id", diseaseOccurrenceController.getOne)
router.put("/diseaseoccurrence/:id", diseaseOccurrenceController.alterOne)
router.delete("/diseaseoccurrence/:id", diseaseOccurrenceController.deleteOne)

//SymptomOccurrence Routes
router.post("/symptomoccurrence", symptomOccurrenceController.create)
router.get("/symptomoccurrence", symptomOccurrenceController.list)
router.put("/symptomoccurrence/:disease_occurrence_id/:symptom_name", symptomOccurrenceController.alterOne)
router.delete("/symptomoccurrence/:disease_occurrence_id/:symptom_name", symptomOccurrenceController.deleteOne)

//AssignedHealthProtocol Routes
router.post("/assignedhealthprotocol", assignedHealthProtocolController.create)

//PatientMovementHistory Routes
router.post("/patientmovementhistory", patientMovementHistoryController.create)
router.get("/patientmovementhistory", patientMovementHistoryController.list)
router.put("/patientmovementhistory/:disease_occurrence_id/:description", patientMovementHistoryController.alterOne)
router.delete("/patientmovementhistory/:disease_occurrence_id/:description", patientMovementHistoryController.deleteOne)

//FAQ Routes
router.post("/faq", faqController.create)
router.get("/faq", faqController.list)
router.put("/faq/:question", faqController.alterOne)
router.delete("/faq/:question", faqController.deleteOne)


export { router };
