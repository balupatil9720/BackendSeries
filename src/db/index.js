// import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";

// const connectDB= async ()=>{
//     try {
//         const ConnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/
//             ${DB_NAME}`)
//             console.log(`MONGODB Connected !! DB_HOST: ${ConnectionInstance.connection.host}`)
//     } catch (error) {
//          console.error(" MONGODB CONNECTION Error",error)
//         process.exit(1)
//     }
// }

// export default connectDB
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Use URI as-is without adding DB_NAME
    const ConnectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(
      `MONGODB Connected !! DB_HOST: ${ConnectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MONGODB CONNECTION Error", error);
    process.exit(1);
  }
};

export default connectDB;
