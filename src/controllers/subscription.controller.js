import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized: User not found in request");
  }

  const existingSub = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (existingSub) {
    // If already subscribed -> unsubscribe
    await existingSub.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unsubscribed successfully"));
  } else {
    // Otherwise subscribe
    const newSub = await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newSub, "Subscribed successfully"));
  }
});



// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400,"Channel Id is required")
    }

    const subscribers=await Subscription.find({channel:channelId}).populate("subscriber",
        "username email"
    )

        return res
        .status(200)
        .json(new ApiResponse(200, subscribers, "Subscribers of Channel  fetched successfully"));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!subscriberId){
        throw new ApiError(400,"subscriberId is required")
    }

    const channels=await Subscription.find({subscriber:subscriberId}).populate("channel",
        "username email"
    )

        return res
        .status(200)
        .json(new ApiResponse(200, channels, "Subscribed channels fetched successfully"));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}