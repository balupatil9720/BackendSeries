import { Router } from "express";
import { addComment,updateComment,deleteComment, getVideoComments } from "../controllers/comment.controller.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/add-comment").post(verifyJWt,addComment)
router.route("/delete-comment/:id").delete(verifyJWt,deleteComment)
router.route("/update-comment/:id").patch(verifyJWt,updateComment)
router.route("/get-comments/:videoId").get(verifyJWt,getVideoComments)

export default router