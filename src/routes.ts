import { Router } from "express";
import { DiseaseController, USMController, VaccineController } from "./controllers";
import { AppointmentController } from "./controllers/AppointmentController";
import { AssignedHealthProtocolController } from "./controllers/AssignedHealthProtocolController";
import { DiseaseOccurrenceController } from "./controllers/DiseaseOccurrenceController";
import { FAQController } from "./controllers/FAQController";
import { HealthProtocolController } from "./controllers/HealthProtocolController";
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
const symptomOccurrenceController = new SymptomOccurrenceController()
const diseaseOccurrenceController = new DiseaseOccurrenceController()
const patientMovementHistoryController = new PatientMovementHistoryController()

router.post("/patients", patientController.create)
router.post("/faq", faqController.create)
router.post("/appointments", appointmentController.create)
router.post("/usm", usmController.create)
router.post("/vaccine", vaccineController.create)
router.post("/disease", diseaseController.create)
router.post("/healthprotocol", healthProtocolController.create)
router.post("/assignedhealthprotocol", assignedHealthProtocolController.create)
router.post("/symptom", symptomController.create)
router.post("/symptomoccurrence", symptomOccurrenceController.create)
router.post("/diseaseoccurrence", diseaseOccurrenceController.create)
router.post("/patientmovementhistory", patientMovementHistoryController.create)

export { router };
