import express from "express";
import {
  onboardSupervisor,
  getSupervisorById,
  getAllSupervisors,
  getSupervisorByObjectId,
  updateSupervisor,
} from "../controllers/supervisor.controller.js";

const router = express.Router();

router.post("/add-supervisor", onboardSupervisor);
router.get("/get-supervisor-by-id/:supervisor_id", getSupervisorById);
router.get(
  "/get-supervisor-by-object-id/:supervisor_id",
  getSupervisorByObjectId
);
router.get("/get-all-supervisors", getAllSupervisors);
router.put("/update-supervisor", updateSupervisor);

export default router;
