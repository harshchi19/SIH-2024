import express from "express";

import {
  addSession,
  updateExistingSession,
  getSessionsByStudentTherapistId,
  getSessionsByPatientId,
  getSessionsByTherapistIdPatientId
} from "../controllers/sessions.controller.js";

const router = express.Router();

router.post("/add-session", addSession);
router.put("/update-session", updateExistingSession);
router.get("/get-sessions-by-patient-id/:patientId", getSessionsByPatientId);
router.get(
  "/get-sessions-by-student-therapist-id/:studentTherapistId",
  getSessionsByStudentTherapistId
);
router.get("/get-sessions-by-therapist-patient-id/:studentTherapistId/:patientId", getSessionsByTherapistIdPatientId);

export default router;
