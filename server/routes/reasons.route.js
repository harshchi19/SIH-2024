import { Router } from "express";
import {
  terminatePatient,
  transferPatient,
} from "../controllers/reasons.controller.js";

const router = Router();

router.post("/terminate-patient", terminatePatient);
router.post("/transfer-patient", transferPatient);

export default router;
