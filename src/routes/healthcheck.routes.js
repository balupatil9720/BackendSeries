import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/health-check").get(verifyJWt,healthcheck)


export default router
