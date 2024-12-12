import express from "express";
import {
  onboardPatient,
  getPatientById,
  getAllPatients,
} from "../controllers/patient.controller.js";

const router = express.Router();

router.post("/add-patient", onboardPatient);
router.get("/get-patient-by-id/:patient_id", getPatientById);
router.get("/all-patients", getAllPatients);

export default router;
