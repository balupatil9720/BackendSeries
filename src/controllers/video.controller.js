import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {UploadOnCloudinary} from "../utils/cloudinary.js"



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    // filter
     const filter={}
      if(userId) filter.owner=userId
      if(query) filter.title={$regex:query,$options:"i"}

      // sort
      const sort={}
      if(sortBy) sort[sortBy]=sortType==="desc"?-1:1;

           // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)


    //fetch videos
      const videos=await Video.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("owner","username email")
      .exec()



 

      return res
      .status(200)
      .json(new ApiResponse(200,{
        videos,
        page: parseInt(page),
        limit: parseInt(limit)
      },"Fetched all videos Successfully"))

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!title||!description){
       throw new ApiError(400,"All fields are required")
    }
 const videoFilePath = req.files?.videoFile?.[0]?.path;
const thumbnailPath = req.files?.thumbnail?.[0]?.path;

if (!videoFilePath || !thumbnailPath) {
  throw new ApiError(400, "Video & thumbnail are required");
}



    const videoFile= await UploadOnCloudinary(videoFilePath)
    const thumbnail= await UploadOnCloudinary(thumbnailPath)

    const video =await Video.create({
        description,
        title,
        videoFile:videoFile.url,
        thumbnail:thumbnail.url,
        duration:videoFile.duration,
        owner:req.user._id
    })

    return res
    .status(201)
    .json(new ApiResponse(201,video,"Video file Successfully Published"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!videoId) {
       throw new ApiError(400,"VideoId is required")  
    }

    const video=await Video.findById(videoId).populate("owner","username email")

    if (!video) {
         throw new ApiError(400,"Video not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,video,"Video File SuccessFully Fetched"))
})

const updateVideo = asyncHandler(async (req, res) => {
  
    //TODO: update video details like title, description, thumbnail
    const { title, description } = req.body
const { videoId } = req.params

  const updates={title,description}
  if(req.file?.path){ 
    const thumbnail= await UploadOnCloudinary(req.file.path)
    if(!thumbnail.url) throw new ApiError(400,"Thumbnail Upload failed")
        updates.thumbnail=thumbnail.url
  }
//   If a new thumbnail is uploaded, send it to Cloudinary.

// Add the returned URL to updates.

  const video=await Video.findByIdAndUpdate(videoId,{$set:updates},{new:true})
  return res
  .status(200)
  .json(new ApiResponse(200,video,"Video Upadated Successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
         throw new ApiError(400,"Video Id is Required")
    }

    const video=await Video.findByIdAndDelete(videoId)

     if (!video) {
        throw new ApiError(404,"Video not found")
     }

     return res
     .status(200)
     .json(new ApiResponse(200,video,"Video deleted SuccessFully"))
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
         throw new ApiError(400,"VideoId is required")
    }

    const video=await Video.findById(videoId)

    if (!video) {
         throw new ApiError(404,"video not found")
    }
    video.isPublished=!video.isPublished
    video.save()
     return res.status(200).json(new ApiResponse(200,{isPublished:video.isPublished},"Publish status Updated"))
    
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}


// // Some info on mongoDB Operators
// $regex: query
// Matches any string that contains the value of query

// query = "fun"
// { title: { $regex: query } }
// Will match titles like "Funny video", "Having fun", "Fun times".

// $options: "i"
// "i" = case-insensitive.
// So "fun" will match "Fun", "FUN", or "fUn".

// If query = "cat"
// Will fetch all videos whose title contains "cat" in any casing: "Cat videos", "funny cat", "CATS compilation".


// sort is used to order the results.
// sortBy = field to sort on (e.g., "views" or "createdAt").
// sortType === "desc" ? -1 : 1 → -1 for descending, 1 for ascending.

// filter is an object we pass to Video.find() to select which videos to fetch.
// if (userId) filter.owner = userId → fetch only videos uploaded by a specific user/channel.
// if (query) filter.title = { $regex: query, $options: "i" } → search videos whose title contains query (case-insensitive).

// pagination
// skip a certain number of results for pagination.
// Pagination is a way to split large amounts of data into smaller, manageable chunks so that clients (like web apps or mobile apps) don’t have to load everything at once

// Why use pagination?
// Improves performce — don’t fetch hundreds or thousands of records in a single request.
// Reduces network load — smaller responses are faster.
// Better user experience — data can be loaded page by page (like scrolling through videos).



// req.files comes from a file-upload middleware like Multer.
// ?. (optional chaining) ensures it doesn’t crash if the file is missing.
// Throws a 400 error if either file is missing.

// uploads the video and thumbnail to Cloudinary.
// videoFile and thumbnail will contain the URL (url) of the uploaded files.