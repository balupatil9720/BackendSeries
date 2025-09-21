import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'    // fs--->stands for file system i nodejs -->helps in file read,write 
// and many other things

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const UploadOnCloudinary=async (localFilePath)=>{
        try {
             if(!localFilePath) return null

             // upload the file on the cloudinary
          const response= await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
             })
             // file has been uplaoded successfully
             console.log("File is uploaded on cloudinary",response.url);
             return response;
              // upload hone ke baad
             // jo public url hai wo
        } catch (error) {
            fs.unlinkSync(localFilePath) // to avoid malicious/corrupted file on server
            // -->ie remove the locally saved temporary file as the upload operation got failed
            return null
        }
    }


    // cloudinary.v2.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 
    //        {public_id: 'shoes', }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });

        export {UploadOnCloudinary}