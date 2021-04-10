import { Router } from "express";
import { DiseaseController, HealthProtocolController, USMController, VaccineController } from "./controllers";
import { AppointmentController } from "./controllers/AppointmentController";
import { FAQController } from "./controllers/FAQController";
import { PatientController } from "./controllers/PatientController";

const router = Router()

const patientController = new PatientController();
const faqController = new FAQController()
const appointmentController = new AppointmentController()
const usmController = new USMController()
const vaccineController = new VaccineController()
const diseaseController = new DiseaseController()
const healthProtocolController = new HealthProtocolController()

//Post routes
router.post("/patients", patientController.create)
router.post("/faq", faqController.create)
router.post("/appointments", appointmentController.create)
router.post("/usm", usmController.create)
router.post("/vaccine", vaccineController.create)
router.post("/disease", diseaseController.create)
router.post("/healthprotocol", healthProtocolController.create)


//Get routes
router.get("/patients", patientController.list)
router.get("/patients/:patient_id", patientController.getOne)
export { router };
