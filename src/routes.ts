import {Router} from "express"
import { FAQController } from "./controllers/FAQController";
import { PatientController } from "./controllers/PatientController";

const router = Router()

const patientController = new PatientController();
const faqController = new FAQController()

router.post("/patients", patientController.create)
router.post("/faq", faqController.create)

export {router}