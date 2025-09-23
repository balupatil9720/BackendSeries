import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { UploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose, { overwriteMiddlewareResult } from "mongoose";


const  GenerateAccessAndRefreshToken = async(userId)=>{
  try {
    const user=await User.findById(userId)
    const accessToken= user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()

    user.refreshToken=refreshToken
   await user.save({validateBeforeSave:false})   // saving the user

   return {accessToken,refreshToken}

  } catch (error) {
     throw new ApiError(500,"Something went wrong while  generating access and refresh token")
  }
}

// const registerUser=asyncHandler(async (req,res)=>{
//   res.status(200).json({
//         message:"ok"
//     })
// })
const registerUser=asyncHandler(async (req,res)=>{

    //----->Algorithm for registering the User


    //get user details from frontend( through postman)
    // validation--->not empty/correct email format
    // check is user already exist:username,email
    // check for images,check for avatar--->multer
    // upload them to cloudinary,avatar
    //create user objects----> create entry in DB
    // remove password and refresh token field from  response
    // check for user creation
    // return  response

console.log("Files received:", req.files);
console.log("Body received:", req.body);
     //get user details from frontend( through postman)
    const {fullName,username,email,password}=req.body
    console.log("email: ",email)
    console.log("password:",password)


        // validation--->not empty/correct email format

   if ([fullName, username, email, password].some((field) => !String(field || "").trim())) {
  throw new ApiError(400, "All fields are Required");
}


    if(!email.includes('@')){
         throw new ApiError(400,"Enter the valid email")
    }
    
    // check is user already exist:username,email
     const ExistedUser= await User.findOne({
        $or:[ {username} ,{ email }]
    })
 if(ExistedUser){
    throw new ApiError(409,"username or email exists")
 }
// if (ExistedUser) {
//   return res.status(409).json({
//     status: "fail",
//     message: "Username or email already registered."
//   });
// }

//  console.log(req.files)
 // check for images,check for avatar--->multer
 const avatarLocalPath = req.files?.avatar?.[0]?.path;
const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;


  if(!avatarLocalPath){
    throw new ApiError(400,"avatar file is required")
    
  }

     // upload them to cloudinary,avatar
  const avatar= await UploadOnCloudinary(avatarLocalPath);
  const coverImage=await UploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
      throw new ApiError(400,"avatar file is required")
  }


  
      //create user objects----> create entry in DB
    const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url||"",
    password,
    email,
    username:username.toLowerCase()
  } )

    const createdUser= await User.findById(user._id).select(
        // remove password and refresh token field from  response
        "-password  -refreshToken"      // whichever will not be taken
    )

     // check for user creation
    if (!createdUser) {
         throw new ApiError(500,"Something  went wrong while registering the user")
    }

        // return  response
     return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Successfully")
     )

})



 // login




const loginUser=asyncHandler(async(req,res)=>{
    // req body -->data le aao
    // username or email
    // find the user
    // password check --->valid or invalid user
    // access and refresh token
    // send cookie


     // req body -->data le aao

     const {email,username,password}=req.body

     if (!(username||email)) {
       throw new ApiError(400,"username or email is required")
     }

       // username or email
      const user=await User.findOne({
      $or:[{username},{email}]
     })

         // find the user
     if (!user) {
       throw new ApiError(404,"User  does not exist")
     }


     // User---->mongoose ke objects access kar sakte  -->findOne
     // user---->own created methods


 // password check --->valid or invalid  password

     const isPasswordCorrect=  await user.isPasswordValid(password)
     
     if (!isPasswordCorrect) {
       throw new ApiError(401,"Enter the valid password")
     }

      // access and refresh token
      const {accessToken,refreshToken}= await GenerateAccessAndRefreshToken(user._id)

      
      const loggedInUser= await User.findById(user._id).select(
        "-password -refreshToken"
      )

      //send cookie
const options={
  httpOnly:true,
  secure:true
}
 return res.
 status(200).
 cookie("accessToken",accessToken,options).
 cookie("refreshToken",refreshToken,options).
 json(
  new ApiResponse(
    200,
  {
    user:loggedInUser,accessToken,refreshToken
  },
  " User logged in Successfully"
  )
 )
})


// logout


const logoutUser= asyncHandler (async(req,res)=>{

   await User.findByIdAndUpdate(
    req.user._id,
    {
      // $set:{
      //   refreshToken:undefined    // it also works
      // }

      $unset:{
        refreshToken:1
      }
    },{
      new:true
    }
  )


  const options={
  httpOnly:true,
  secure:true
}

return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,{},"User Successfully logged out"))

})


const RefreshAccessToken= asyncHandler(async (req,res)=>{
  
  const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
     throw new ApiError(401,"Unauthorised request")
  }

  try {
    const decodedToken=jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
  
   const user= await User.findById(decodedToken?._id)
  
   if (!user) {
    throw new ApiError(401,"Invalid Refresh Token")
   }
  
   if (incomingRefreshToken!==user?.refreshToken) {
     throw new ApiError(401,"Refresh Token is expired or used")
   }
     const options={
    httpOnly:true,
    secure:true
  }
  
  const {accessToken,newrefreshToken}=await GenerateAccessAndRefreshToken(user._id)
  
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",newrefreshToken,options)
  .json(
    new ApiResponse(
      200,
      {accessToken,refreshToken:newrefreshToken},
    "Access token refreshed Successfully"
    )
  )
  } catch (error) {
     throw new ApiError(401,error?.message||"Invalid Refresh Tokenn")
  }

})



const ChangeCurrentPassword=asyncHandler(async(req,res)=>{

  const {oldPassword,newPassword}=req.body

  const user=await User.findById(req.user?._id)
  const isPasswordCorrect=await user.isPasswordValid(oldPassword)

  if (!isPasswordCorrect) {
     throw new ApiError(400,"Invalid old password")
  }
  user.password=newPassword

  await user.save({validateBeforeSave:false})

  return res
  .status(200)
  .json(new ApiResponse(200,{},"Password changed Successfully"))
})

 const getCurrentUser=asyncHandler(async(req,res)=>{
 return res
 .status(200)
 .json(new ApiResponse(200,req.user,"User fetched Successfully"))
 })


 
 const UpdateAccountDetails=asyncHandler(async(req,res)=>{
  const {fullName,email}=req.body

  if (!fullName||!email) {
    throw new ApiError(400,"All Fields are Required")
  }
   const user= await User.findByIdAndUpdate(
    req.user?._id,
    {   $set:{      // mongodb ke operators 
      fullName,
      email:email      
    }
  },
    {new:true} // update hone ke baad jo information hota hai wo bhi return hota hai
  ).select("-password")

   return res
 .status(200)
 .json(new ApiResponse(200,user,"Account Details Updated Successfully"))
 })


 const UpdateUserAvatar=asyncHandler(async(req,res)=>{
    const LocalAvatarPath=req.file?.path
    
    if (!LocalAvatarPath) {
       throw new ApiError(400,"Avatar file is missing")
    }

    const avatar= await UploadOnCloudinary(LocalAvatarPath)

    if (!avatar.url) {
      throw new ApiError(400,"Error while uploading avatar on Cloudinary")
    }
      const user= await User.findByIdAndUpdate(
    req.user?._id,
    {   $set:
      {      // mongodb ke operators 
      avatar:avatar.url      
    }
  },
    {new:true} // update hone ke baad jo information hota hai wo bhi return hota hai
  ).select("-password")

  return res
 .status(200)
 .json(new ApiResponse(200,user,"Avatar Updated Successfully"))
 })

 const UpdateUsercoverImage=asyncHandler(async(req,res)=>{
    const LocalcoverImagePath=req.file?.path
    
    if (!LocalcoverImagePath) {
       throw new ApiError(400,"coverimage file is missing")
    }

    const coverImage= await UploadOnCloudinary(LocalcoverImagePath)

    if (!coverImage.url) {
      throw new ApiError(400,"Error while uploading coverImage on Cloudinary")
    }
      const user= await User.findByIdAndUpdate(
    req.user?._id,
    {   $set:
      {      // mongodb ke operators 
      coverImage:coverImage.url      
    }
  },
    {new:true} // update hone ke baad jo information hota hai wo bhi return hota hai
  ).select("-password")

  return res
 .status(200)
 .json(new ApiResponse(200,user,"CoverImage Updated Successfully"))

 })

 const getUserChannelProfile=asyncHandler(async(req,res)=>{
      const {username}=req.params
      if (!username?.trim()) {
        throw new ApiError(400,"username is missing")
      }

      // writing mongo db pipelines
       const channel=await User.aggregate([
        {
          $match:{
            username:username?.toLowerCase()
          }
        },{
          $lookup:{      // to find  who have subscribed the channel
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
          }
        },
        {
          $lookup:{      // to find to whom i have subscribed 
            from:"subscriptions",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribedTo"
          }
        },{
          $addFields:{    
              subscrriberscount:{    // to find no of subscribers to channel
                $size:"$subscribers"
              },
              channelSubsrcibedTo:{  // to find number of channels which i am subscribed 
                $size:"$subscribedTo"
              },
              isSubsribed:{  //  to check wheteher i  have subscribed  to channel or not
                $cond:{
                  if: {
      $in: [
        req.user?._id,
        {
          $map: {
            input: "$subscribers",
            as: "sub",
            in: "$$sub.subscriber"
          }
        }
      ]
    },
                  then:true,
                  else:false
                }
              }
          }
        },{
          $project:{    // gives the fields that shows whichever to display/ tto give to frotend
            fullName:1,
            username:1,
             subscrriberscount:1,
              channelSubsrcibedTo:1,
              isSubsribed:1,
              avatar:1,
              coverImage:1,
              email:1

          }
        }
       ])
       if (!channel) {
        throw new ApiError(404,"Channel does not exist")
       }

       return res
       .status(200)
       .json( new ApiResponse(200,channel[0],"User channel fetched Successfully"))
 })

 const getWatchHistory=asyncHandler(async(req,res)=>{
//  req.user._id---> usually get string which at the backend is converted into mongodb id
 // but aggeration pipelines ka code directly jata hai hence we need to convert that
const user=await User.aggregate([
  {
     $match:{
      _id: new mongoose.Types.ObjectId(req.user._id)
     }
  },{
    $lookup:{
      from:"videos",
      localField:"watchHistory",
      foreignField:"_id",
      as:"watchHistory",
      pipeline:[          // writing the sub pipelines
        {
          $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"owner",
            pipeline:[
              {
                $project:{
                  fullName:1,
                  username:1,
                  avatar:1
                }
              }
            ]
          }
        },{
          $addFields:{
            owner:{
              $first:"$owner"
            }
          }
        }
      ]
    }
  }
])
 return res
 .status(200)
 .json(
  new ApiResponse(200,user.watchHistory,"watchHistory fetched  Successfully")
 )
 })
export {
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

}