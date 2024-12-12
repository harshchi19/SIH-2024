import { Router } from "express";
import {
  getUnallocatedPatients,
  matchPatients,
} from "../controllers/matchmaking.controller.js";

const router = Router();

router.get("/get-unallocated-patients", getUnallocatedPatients);
router.post("/match-patients", matchPatients);

export default router;
