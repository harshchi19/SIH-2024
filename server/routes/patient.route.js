import express from "express";
import { onboardPatient } from "../controllers/patient.controller.js";
import { generateMasterKey } from "../controllers/keys.controller.js";

const router = express.Router();

router.post("/add-patient", onboardPatient);

export default router;