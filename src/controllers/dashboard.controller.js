import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views,
    //  total subscribers, total videos, total likes etc.
              const {channelId}= req.params
   if (!channelId) {
     throw new ApiError(400,"Channel Id is required")
   }

   const videoStats= await Video.aggregate([
    {$match:{owner:new mongoose.Types.ObjectId(channelId)}},
    {
        $group:{
            _id:null,
            totalViews:{$sum:"$views"},
            totalVideos:{$sum:1}
        }
    }
   ])
   
  const totalViews = videoStats.length > 0 ? videoStats[0].totalViews : 0
  const totalVideos = videoStats.length > 0 ? videoStats[0].totalVideos : 0

    const totalSubscribers=await Subscription.countDocuments({subscribedTo:channelId})

    const videoIds= await Video.find({owner:channelId}).distinct("_id")
    const TotalLikes=await Like.countDocuments({video:{$in:videoIds}})

    return res
    .status(200)
    .json(new ApiResponse(200,{
        totalSubscribers,
        TotalLikes,
        totalViews,
        totalVideos
    },"Video stats fetched successfully"))

} )       

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

     const {channelId} =req.params
     const {page=1,limit=10}=req.query

     if (!channelId) {
         throw new ApiError(400,"Channel Id is required")
     }
     const skip=(parseInt(page)-1)*parseInt(limit)


     const videos=await Video.find({owner:channelId})
     .sort({createdAt:-1})
     .skip(skip)
     .limit(parseInt(limit))
     .populate("owner","username email")
     .exec()

     const totalVideos=await Video.countDocuments({owner:channelId})

     return res
     .status(200)
     .json(new ApiResponse(200,{
        videos,
        page:parseInt(page),
        limit:parseInt(limit),
        totalPages:Math.ceil(totalVideos/limit),
        totalVideos
     },"Videos of the channel fetched Successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }

    // Explanation of the Aggregation pipelines used in this code
//     $match
// Filters documents before doing any calculation.-->{ owner: new ObjectId(channelId) }

// $group
// Groups documents together and allows aggregation(similar to aggregate functions ) calculations.

// _id: null → means group all documents into one single group (no grouping by field).

// totalViews: { $sum: "$views" } → sums up all views field values from the matched videos.
// totalVideos: { $sum: 1 } → counts total documents (every document adds 1).