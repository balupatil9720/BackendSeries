// require('dotenv').config({path:'./env'})

import dotenv from 'dotenv'
import connectDB from "./db/index.js";


dotenv.config({
    path:'./env'
})

connectDB()
















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