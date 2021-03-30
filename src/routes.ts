import {Router} from "express"
import { AppointmentController } from "./controllers/AppointmentController";
import { FAQController } from "./controllers/FAQController";
import { PatientController } from "./controllers/PatientController";

const router = Router()

const patientController = new PatientController();
const faqController = new FAQController()
const appointmentController = new AppointmentController()

router.post("/patients", patientController.create)
router.post("/faq", faqController.create)
router.post("/appointments", appointmentController.create)
export {router}