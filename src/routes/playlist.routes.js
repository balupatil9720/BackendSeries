import { Router } from "express";
import { verifyJWt } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, 
    deletePlaylist, 
    getPlaylistById, getUserPlaylists, 
    removeVideoFromPlaylist, 
    updatePlaylist} from "../controllers/playlist.controller.js";


const router=Router()


 router.route("/create-playlist").post(verifyJWt,createPlaylist)
 router.route("/get-userplaylist/:userId").get(verifyJWt,getUserPlaylists)
 router.route("/getPlaylist-ById/:playlistId").get(verifyJWt,getPlaylistById)
 router.route("/add-video/:playlistId/:videoId").patch(verifyJWt,addVideoToPlaylist)
 router.route("/delete-video/:playlistId/:videoId").patch(verifyJWt,removeVideoFromPlaylist)
 router.route("/delete-playlist/:playlistId").delete(verifyJWt,deletePlaylist)
 router.route("/update-playlist/:playlistId").patch(verifyJWt,updatePlaylist)


export default router