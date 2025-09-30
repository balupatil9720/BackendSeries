import { Router } from "express";
import { verifyJWt } from "../middlewares/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const router=Router()


router.route("/get-stats/:channelId").get(verifyJWt,getChannelStats)
router.route("/get-videos/:channelId").get(verifyJWt,getChannelVideos)

export default router