import { Router } from "express";
import { verifyJWt } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, 
    updateTweet } from "../controllers/tweet.controller.js";



const router=Router()

router.route("/create-tweet").post(verifyJWt,createTweet)
router.route("/update-tweet/:id").patch(verifyJWt,updateTweet)
router.route("/delete-tweet/:id").delete(verifyJWt,deleteTweet)
router.route("/get-tweets/:id").get(verifyJWt,getUserTweets)

export default router