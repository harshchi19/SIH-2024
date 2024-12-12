import { Router } from "express";
import {
  addAdmin,
  getAdminById,
  getAdminObjectById,
  getAllAdmins,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/get-admin-by-id/:admin_id", getAdminById);
router.get("/get-admin-object-by-id/:admin_id", getAdminObjectById);
router.get("/get-all-admins", getAllAdmins);
router.post("/add-admin", addAdmin);

export default router;
