import { Router } from "express";
import { USMController, VaccineController } from "./controllers";
import { AppointmentController } from "./controllers/AppointmentController";
import { FAQController } from "./controllers/FAQController";
import { PatientController } from "./controllers/PatientController";

const router = Router()

const patientController = new PatientController();
const faqController = new FAQController()
const appointmentController = new AppointmentController()
const usmController = new USMController()
const vaccineController = new VaccineController()

router.post("/patients", patientController.create)
router.post("/faq", faqController.create)
router.post("/appointments", appointmentController.create)
router.post("/usm", usmController.create)
router.post("/vaccine", vaccineController.create)
export { router };
