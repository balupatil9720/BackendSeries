const asyncHandler=(requestHandler)=>{
     (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err) => next(err))
     }
}




export {asyncHandler}


// asyncHandler---> Higher order function-->jo functions ko as a parameter bhi accept kar sakte hai
// aur return bhi kar sakte hai


// wrapper function  using try catch
// const asyncHandler=(fn)=> async (req,res,next)=>{
//     try {
//          await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code||500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }     // higher  order function