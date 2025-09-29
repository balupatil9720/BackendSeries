import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {owner,content}=req.body

    if(!owner||!content){
        throw new ApiError(400,"All fields are required")
    }

    const tweet=await Tweet.create({owner,content})

    return res
    .status(200)
    .json(new ApiResponse(200,tweet,"Tweet created Successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {id} =req.params
    const {page=1,limit=10}=req.query

    if (!id) {
        throw new ApiError(400,"id is required")
    }

    const skip=(parseInt(page)-1)*parseInt(limit);

    const tweets=await Tweet.find({owner:id})
    .sort({createdAt:-1})
    .skip(skip)
    .limit(parseInt(limit))
    // .populate("owner","username email")
    .exec()


    const TotalTweets=await Tweet.countDocuments({owner:id})

    return res
    .status(200)
    .json( new ApiResponse (
        200,{
            tweets,
            page:parseInt(page),
            limit:parseInt(limit),
            totalPages:Math.ceil(TotalTweets/page),
            TotalTweets
        }
    ))

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {id}=req.params
    const {content}=req.body

    if(!id){
        throw new ApiError(404,"Comment Id not found")
    }

    if(!content){
        throw new ApiError(400,"Conetent is required to update the Comment")
    }
    const tweet=await Tweet.findById(id)

    if (!tweet) {
         throw new ApiError(404,"Tweet not found")
    }
    tweet.content=content
    tweet.save()

    return  res
    .status(200)
    .json(new ApiResponse(200,tweet,"Tweet updated Successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {id}=req.params

    if (!id) {
        throw new ApiError(400,"Tweet Id is required to delete")
    }

    const tweet =await Tweet.findByIdAndDelete(id)

    if (!tweet) {
        throw new ApiError(404,"Tweet not found")
    }
     return  res
    .status(200)
    .json(new ApiResponse(200,tweet,"Tweet updated Successfully"))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}