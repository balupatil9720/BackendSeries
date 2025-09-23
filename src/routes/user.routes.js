import { Router } from "express";
import { 
 registerUser,
  loginUser,
  logoutUser,
  RefreshAccessToken,
  ChangeCurrentPassword,
  getCurrentUser,
  UpdateAccountDetails,
  UpdateUserAvatar,
  UpdateUsercoverImage,
  getUserChannelProfile,
  getWatchHistory 
    } from "../controllers/user.controller.js";
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

router.route("/refresh-token").post(RefreshAccessToken)

router.route("/change-password").post(verifyJWt,ChangeCurrentPassword)
router.route("/current-user").post(verifyJWt,getCurrentUser)
// verifyJwt---> to check if user  logged in or not
router
.route("/update-account")
.patch(
  verifyJWt,
  UpdateAccountDetails)
// IN The above post is not used because it will update all the details

// PATCH--->change the part of resource

// only updating  avatar hence patch
router
.route("/avatar")
.patch(verifyJWt,
  upload.single("avatar"),
  UpdateUserAvatar)

//Similarly for CoverImage
router.
route("/cover-image")
.patch(verifyJWt,
  upload.single("coverImage"),
  UpdateUsercoverImage)

// now since we are using from params sybtax changes
// and user kuch bhej to nahi rahe isliye --->get
router.route("/c/:username").get(verifyJWt,getUserChannelProfile)

router.route("/history").get(verifyJWt,getWatchHistory)

export default router