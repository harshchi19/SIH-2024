import { Router } from "express";
import { getUnallocatedPatients } from "../controllers/matchmaking.controller.js";

const router = Router();

router.get("/get-unallocated-patients", getUnallocatedPatients);

export default router;
