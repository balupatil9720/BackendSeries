import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
 if (!name||!description) {
        throw new ApiError(400,"All fields are required")
    }

    const playlist=await Playlist.create({
     name,
     description,
     owner:req.user._id
    })
    
          return res
      .status(200)
      .json(new ApiResponse(200,playlist,"Playlist Created SuccessFully"))
    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
     if (!userId) {
        throw new ApiError(400,"UserId is required")
    }

    const playlists=await Playlist.findById(userId).populate("videos")

    if(!playlists){
        throw new ApiError(404,"Playlsit Not Found") 
    }
          return res
      .status(200)
      .json(new ApiResponse(200,playlists,"Playlists of the User fetched SuccessFully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
     if (!playlistId) {
        throw new ApiError(400,"PlaylistId is required")
    }

    const playlist=await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404,"Playlsit Not Found") 
    }
          return res
      .status(200)
      .json(new ApiResponse(200,playlist,"Playlist Fouund SuccessFully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

     if (!playlistId||!videoId) {
        throw new ApiError(400,"All fields required")
    }

    const playlist=await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404,"Playlsit Not Found") 
    }

    if(!playlist.videos.includes(videoId)){
        playlist.videos.push(videoId)
         await playlist.save()
    }
          return res
      .status(200)
      .json(new ApiResponse(200,playlist,"Video Added to PLaylist  SuccessFully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
      if (!playlistId||!videoId) {
        throw new ApiError(400,"All fields required")
    }

    const playlist=await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404,"Playlsit Not Found") 
    }

    
    playlist.videos = playlist.videos.filter(id => id.toString() !== videoId);
    await playlist.save();
    
          return res
      .status(200)
      .json(new ApiResponse(200,playlist,"Video Deleted From PLaylist  SuccessFully"))
    

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if (!playlistId) {
        throw new ApiError(400,"PlaylistId is required")
    }

    const playlist=await Playlist.findByIdAndDelete(playlistId)

    if(!playlist){
        throw new ApiError(404,"Playlsit Not Found") 
    }
          return res
      .status(200)
      .json(new ApiResponse(200,playlist,"Playlist Deleted SuccessFully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if (!playlistId) {
         throw new ApiError(400,"PlaylistId is required")
    }

     const updates={name,description}
     if(name) updates.name=name;
     if(description) updates.description=description
     const playlist =await Playlist.findByIdAndUpdate(playlistId,{$set:updates},{new:true});

     if (!playlist) {
        throw new ApiError(404,"Playlsit Not Found") 
     }
      return res
      .status(200)
      .json(new ApiResponse(200,playlist,"Playlist Upadated SuccessFully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}


// Explanation

//     playlist.videos = playlist.videos.filter(id => id.toString() !== videoId);
//     await playlist.save();


//     playlist.videos
// This is the array inside your playlist document that stores video IDs (probably MongoDB ObjectIds).
// .filter(...)
// The .filter() function loops through every element in the array and keeps only those elements for which the condition is true.
// That means: “Keep this id only if it is NOT equal to the videoId we want to remove.”
// id.toString()
// id is a MongoDB ObjectId.
// To compare it with videoId (which comes as a string from req.params), we convert it to a string using .toString().
// Example:
// id = ObjectId("64a123")
// id.toString() = "64a123"
// Result
// After filtering, the array no longer contains the unwanted video