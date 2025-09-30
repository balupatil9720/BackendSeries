import { Router } from "express";
import { verifyJWt } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()

 router.route("/get-videos").get(verifyJWt,getAllVideos)
 router.post(
  "/publish-video",
  verifyJWt,
  upload.fields([
    { name: "videoFile", maxCount: 1 },      // very very imp when uploading done
    { name: "thumbnail", maxCount: 1 }
  ]),
  publishAVideo
);
 router.route("/get-video/:videoId").get(verifyJWt,getVideoById)
 router.route("/update-video/:videoId").patch(verifyJWt,upload.single("thumbnail"),updateVideo)
 router.route("/delete-video/:videoId").delete(verifyJWt,deleteVideo)
 router.route("/toogle-publish/:videoId").patch(verifyJWt,togglePublishStatus)

export default router
