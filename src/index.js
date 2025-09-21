// require('dotenv').config({path:'./env'})

import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import { app } from './app.js';


dotenv.config();

connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`The server is running on Port: ${process.env.PORT}`)
    });
})
.catch((err)=>{
    console.log("MongoDB Connection failed!!!!!!",err);
})
















// method A---> all in  the index file --->using IFFE
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from  'express'
// // databases   can have errors--->hence always use try catch or promise
// // database is always in another continent  --->hence always use async await
//  const app =express()
     

// ;(async ()=>{
//     try{
//      await mongoose.connect(`${process.env.MONGODB_URI}/
//         {DB_NAME}`);


//         app.on("error",(error)=>{              // listener
//             console.log("error",error);
//             throw error
//         }); 

//      app.listen(process.env.PORT,()=>{
//          console.log(`The app is listening on the PORT ${process.env.PORT}`)
//      });
//     }
//     catch(error){
//         console.error("Error:",error)
//         throw err
//     }
// })()