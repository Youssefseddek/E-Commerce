

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(error => {
            res.status(500).json({ message: 'Internal Server Error', errMsg: error.message, stack: error.stack })
            // return next(new Error (error,{cause:500}))
        })
    }

}



export const globalErrorHandling = (err,req,res,next)=>{
    if (err) {
        console.log(err);
        if (process.env.MOOD === 'DEV') {
            res.status(err.cause || 500).json({message:err.message ,stack:err.stack})
        } else {
            res.status(err.cause || 500).json({message:err.message })
        }
       
    } 
}