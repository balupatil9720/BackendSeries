import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {userId}=req.user._id

    if (!videoId) {
         throw new ApiError(400,"Video id is required")
    }

    const existingLike=await Like.findOne({video:videoId,user:userId})

    if (existingLike) {
        await Like.deleteOne({_id:existingLike._id})
        return res.status(200).json(new ApiResponse(200,{liked:false},"Video unliked"))  
    }
    else{
        await Like.create({video:videoId,user:userId})
         return res.status(200).json(new ApiResponse(200,{liked:true},"Video liked"))  
    }
    //TODO: toggle like on video
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const {userId}=req.user._id

    if (!commentId) {
         throw new ApiError(400,"Comment Id is required")
    }

    const existingLike= await Like.findOne({comment:commentId,user:userId})

    if(existingLike){
        await Like.deleteOne({_id:existingLike._id})
        return res.status(200).json(new ApiResponse(200,{liked:false}," Comment unliked"))
    }
    else{
        await Like.create({comment:commentId,user:userId})
           return res.status(200).json(new ApiResponse(200,{liked:true},"Comment liked"))
    }
    

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const {userId}=req.user._id

    if (!tweetId) {
         throw new ApiError(400,"Tweet Id is required")
    }

    const existingLike= await Like.findOne({tweet:tweetId,user:userId})

    if(existingLike){
        await Like.deleteOne({_id:existingLike._id})
        return res.status(200).json(new ApiResponse(200,{liked:false},"Tweet Unliked"))
    }
    else{
        await Like.create({tweet:tweetId,user:userId})
           return res.status(200).json(new ApiResponse(200,{liked:true},"Tweet liked"))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const {userId}=req.user._id

    const likedvideos=await Like.find({likedBy:userId,video:{$exists:true,$ne:null}})
    .populate({
        path:"video",
        populate:{
            path:"owner",
            select:"email username"
        }
    })
    .exec()

// likedBy: userId → only likes created by the current user.

// video: { $exists: true, $ne: null } → only likes that are actually on videos (not comments/tweets).

// .populate("video") → fetch video details.

// .populate("owner") → also fetch the user who uploaded the video.
    return res
    .status(200)
    .json(new ApiResponse(200,likedvideos,"Succesfully fetched all the liked videos"))

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}