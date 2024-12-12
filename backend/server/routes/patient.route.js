import express from "express";
import {
  onboardPatient,
  getPatientById,
  getAllPatients,
  getPatientByObjectId,
} from "../controllers/patient.controller.js";

const router = express.Router();

router.post("/add-patient", onboardPatient);
router.get("/get-patient-by-id/:patient_id", getPatientById);
router.get("/get-patient-by-object-id/:patient_id", getPatientByObjectId);
router.get("/all-patients", getAllPatients);

export default router;
