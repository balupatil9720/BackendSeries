import { Router } from "express";
import { verifyJWt } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";


const router=Router()

 router.route("/toggle-subscribe/:channelId").patch(verifyJWt,toggleSubscription)
 router.route("/get-subscribers/:channelId").get(verifyJWt,getUserChannelSubscribers)
 router.route("/get-channels/:subscriberId").get(verifyJWt,getSubscribedChannels)

export default router