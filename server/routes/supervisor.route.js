import express from "express";
import {
  onboardSupervisor,
  getSupervisorById,
  getAllSupervisors,
  getSupervisorByObjectId,
} from "../controllers/supervisor.controller.js";

const router = express.Router();

router.post("/add-supervisor", onboardSupervisor);
router.get("/get-supervisor-by-id/:supervisor_id", getSupervisorById);
router.get("/get-supervisor-by-object-id/:supervisor_id", getSupervisorByObjectId);
router.get("/get-all-supervisors", getAllSupervisors);

export default router;
