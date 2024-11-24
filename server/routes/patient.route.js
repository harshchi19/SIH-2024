import express from "express";
import { onboardPatient } from "../controllers/patient.controller.js";

const router = express.Router();

router.post("/add-patient", onboardPatient);

export default router;