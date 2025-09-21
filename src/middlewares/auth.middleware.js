import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import 'dotenv/config';


 
 
 
 export const verifyJWt=asyncHandler(async(req,_,next)=>{
    try {
       const token =
  req.cookies?.accessToken ||
  req.header("Authorization")?.replace(/^Bearer\s+/i, "")?.trim();

  console.log("Token received for verification:", token);
    
        if (!token) {
             throw new ApiError(401,"Unauthorised request")
        }
    
         const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
          const user=await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
         )
    
         if (!user) {
            throw new ApiError(401,"Invalid Access Token")
         }
         req.user=user
         next()
    } catch (error) {
         throw new ApiError(401,error?.message||"Invalid ACCESS Token")
    }
 })