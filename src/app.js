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
  import healthCheckRouter from './routes/healthcheck.routes.js';
  import  CommentRouter from './routes/comment.routes.js'
  import  TweetRouter from './routes/tweet.routes.js'
  import  LikeRouter from './routes/like.routes.js'
  import    DashboardRouter from  './routes/dashboard.routes.js'
  import   VideoRouter from  './routes/video.routes.js'
  import SubscriptionRouter from './routes/subscription.routes.js'
  import PlaylistRouter from './routes/playlist.routes.js'


  //routes declaration
  app.use("/api/v1/users",userRouter)
  app.use("/api/v1/healthcheck",healthCheckRouter)
  app.use("/api/v1/comment",CommentRouter)
  app.use("/api/v1/tweet",TweetRouter)
  app.use("/api/v1/like",LikeRouter)
   app.use("/api/v1/dashboard",DashboardRouter)
   app.use("/api/v1/video",VideoRouter)
   app.use("/api/v1/subscription",SubscriptionRouter)
   app.use("/api/v1/playlist",PlaylistRouter)

  // eg
  // http://localhost:8000/api/v1/users/register


export { app }