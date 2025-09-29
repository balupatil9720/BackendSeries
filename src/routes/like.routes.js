import { Router } from "express";
import { verifyJWt } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";


const router=Router()

router.route("/like-video/:videoId").patch(verifyJWt,toggleVideoLike)
router.route("/like-comment/:commentId").patch(verifyJWt,toggleCommentLike)
router.route("/like-tweet/:tweetId").patch(verifyJWt,toggleTweetLike)
router.route("/fetch-liked-videos/:id").get(verifyJWt,getLikedVideos)


export default router