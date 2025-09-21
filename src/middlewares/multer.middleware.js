import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {   // has extra parameter -->file so 
  // file upload/multer is used
    cb(null, "public/temp") //  2nd   parameter is to keep the files that folder is mentioned
   },
  filename: function (req, file, cb) {   // cb-->call back
    cb(null, file.originalname)
  }
})

 export const upload = multer({
     storage,
     })

     // storage-->multer--->is used as middleware here
