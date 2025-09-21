import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { UploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


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

     const {email,username,password}=req.body()

     if (!username||!email) {
       throw new ApiError(400,"username or password is required")
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

      
      const loggedInUser=User.findById(user._id).select(
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



const logoutUser= asyncHandler (async(req,res)=>{

   await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
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

export {
  registerUser,
  loginUser,
  logoutUser

}