import { Router } from "express";
import {
  getHodById,
  getHodObjectById,
  getAllHods,
} from "../controllers/hod.controller.js";

const router = Router();

router.get("/get-hod-by-id/:hod_id", getHodById);
router.get("/get-hod-object-by-id/:hod_id", getHodObjectById);
router.get("/get-all-hods", getAllHods);

export default router;
