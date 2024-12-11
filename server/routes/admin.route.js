import { Router } from "express";
import { getAdminById } from "../controllers/admin.controller.js";

const router = Router();

router.get("/get-admin-by-id/:admin_id", getAdminById);

export default router;
