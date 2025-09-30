import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// explicitly load .env from project root
dotenv.config({ path: "../../.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
  try {
    const res = await cloudinary.api.ping();
    console.log(" Cloudinary connection successful:", res);
  } catch (err) {
    console.error(" Cloudinary connection failed:", err.message);
  }
})();
