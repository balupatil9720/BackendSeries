import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app= express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
// configurations
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

 // url se mostly jo data ata hai wo params se hi ata hai ---->req.params
 // mostly when we use middle wares -->we use app.use(cors())

 // cookie parser --> mostly  used  to access and set cookies in the browser


 // route imports

  import userRouter from './routes/user.routes.js';


  //routes declaration
  app.use("/api/v1/users",userRouter)

  // eg
  // http://localhost:8000/api/v1/users/register


export { app }