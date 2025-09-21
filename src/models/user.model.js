import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

 const userSchema= new Schema({

     username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
     },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
     },
        fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
     },
         avatar:{
        type:String,   // cloudinary url
        required:true,
     },
     watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
     ],
     password:{
        type:String,
        required:[true,"Password is required"]
     },
     refreshToken:{
        type:String
     }
 },
 {
    timestamps:true
 });

  //  encrypting password
  userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password= await bcrypt.hash(this.password,10); // 10-->number of rounds in encryption
    next()
  })

  // adding custom methods   ---> to check password
  userSchema.methods.isPasswordValid=async function (password){
    return await bcrypt.compare(password,this.password);
  }


  // method to generate the Access token
  userSchema.methods.generateAccessToken= function(){
     return jwt.sign(
        {
            _id:this.id,
            email:this.email,
            username:this.username,
            fullName:this.fullName

        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
  }

   // method to generate the Refresh token
  userSchema.methods.generateRefreshToken= function(){
     return jwt.sign(
        {
            _id:this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
  }
   //  userSchema.methods.generateRefreshToken= function(){}

       // for token--->jsonwebtoken/(jwt)
 // becrypt---->  library that helps to hash your passwords
  export const  User=mongoose.model("User",userSchema);


  // middlewares--->hooks----> pre--->

  // jwt token--->bear token
  // ACCESS_TOKEN--->NOT STORED IN THE DATABASE 
  // REFRESH-TOKEN---> STORED IN THE DATABASE