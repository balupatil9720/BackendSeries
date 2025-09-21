import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { UploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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


     //get user details from frontend( through postman)
    const {fullName,username,email,password}=req.body
    console.log("email: ",email)
    console.log("password:",password)


        // validation--->not empty/correct email format

    if (
        [fullName,username,email,password].some((field)=>field?.trim()==="")
    ) {
         throw new ApiError(400,"All fields are  Required")
    }

    if(!email.includes('@')){
         throw new ApiError(400,"Enter the valid email")
    }
    
    // check is user already exist:username,email
     const ExistedUser=User.findOne({
        $or:[ {username} ,{ email }]
    })
 if(ExistedUser){
    throw new ApiError(409,"username or email exists")
 }

 // check for images,check for avatar--->multer
  const avatarLocalPath=req.files?.avatar[0]?.path;
  const coverImageLocalPath=req.files?.coverImage[0]?.path;

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



export {registerUser}