import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
// page → current page number (default 1)

// limit → number of comments per page (default 10)
    if (!videoId) {
        throw new ApiError(400,"Video Id is required")
    }

    // Pagination math: determines how many documents to skip.
    const skip= (parseInt(page)-1)*parseInt(limit)

    const comments=await Comment.find({video:videoId})
    .sort({createdAt:-1})
    .skip(skip)
    .limit(parseInt(limit))
    .populate("owner","usernanme email")
    .exec()

    // Comment.find({ video: videoId })

// Fetches comments only for this video.

// .sort({ createdAt: -1 })

// Sorts comments by newest first (-1 means descending).

// .skip(skip)

// Skips the first skip comments (used for pagination).

// .limit(parseInt(limit))

// Returns only up to limit comments.

// .populate("owner", "name email")

// Replaces owner ObjectId with actual user info (only name and email).

// .exec()

// Executes the query and returns a promise.
    
    const totalComments=await Comment.countDocuments({video:videoId})

    return res
    .status(200)
    .json( new ApiResponse(200,
     {
           comments,
        page:parseInt(page),
        limit:parseInt(limit),
        totalPages:Math.ceil(totalComments/limit),
        totalComments
     }
//      comments → array of comment documents

// page → current page number

// limit → number of comments per page

// totalPages → total pages = Math.ceil(totalComments / limit)

// totalComments → total comments for this video,
,
     "Comments Fetched Successfully"
    ))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content,video,owner}=req.body

    if (!content || !video || !owner) {
         throw new ApiError(400,"All fields are required");
    }

    const comment =await    Comment.create({content,video,owner})

    return res
    .status(200)
    .json( new ApiResponse(200,comment,"Comment Added Successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {id} =req.params
    const {content}=req.body
   if (!content) {
     throw new ApiError(400,"Content is required to Update the Comment")
   }
    const comment=await Comment.findById(id)
    
    if (!comment) {
    throw new ApiError(404,"Comment Not Found")
    }

//     if (comment.owner.toString() !== req.user._id) {
//     throw new ApiError(403, "You are not allowed to update this comment");
// }

    comment.content=content
     await comment.save()

    return res
    .status(200)
    .json(  new ApiResponse(200,comment,"Comment Upadated Successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {id}= req.params
    if (!id) {
         throw new ApiError(400,"Comment id is required")
    }
    const comment=await Comment.findByIdAndDelete(id)

    if (!comment) {
         throw new ApiError(404,"Comment not found")
    }

    return res
    .status(200)
    .json( new ApiResponse(200,comment,"Comment removed successfully"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }