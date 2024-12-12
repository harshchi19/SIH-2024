import { Router } from "express";
import {
  checkOnboardingStatus,
  onboardingAuthUser,
} from "../controllers/onboarding.controller.js";

const router = Router();

router.get("/check-onboarding-status/:userId/:userType", checkOnboardingStatus);
router.post("/onboard-auth-user", onboardingAuthUser);

export default router;
