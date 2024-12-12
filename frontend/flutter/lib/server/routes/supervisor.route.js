import express from "express";
import {
  onboardSupervisor,
  getSupervisorById,
  getAllSupervisors,
} from "../controllers/supervisor.controller.js";

const router = express.Router();

router.post("/add-supervisor", onboardSupervisor);
router.get("/get-supervisor-by-id/:supervisor_id", getSupervisorById);
router.get("/get-all-supervisors", getAllSupervisors);

export default router;
