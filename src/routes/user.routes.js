import { Router } from "express";
import { loginUser, logoutUser, registerUser ,RefreshAccessToken } 
from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";



const router=Router()

  router.route("/register").post(
   upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]),
    registerUser
  )

router.route("/login").post(loginUser)



// secured routes
router.route("/logout").post(verifyJWt,logoutUser)

router.route("/refresh_token").post(RefreshAccessToken)

export default router