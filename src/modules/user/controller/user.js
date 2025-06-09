import userModel from "../../../../DB/model/user.model.js"
import { asyncHandler } from "../../../services/handelError.js"



export const getWishlist = asyncHandler(async (req, res, next) => {
    console.log('req.user._id', req.user._id);
    
    const user = await userModel.findById(req.user._id).populate("wishlist")
    if (!user) {
        return next(new Error(`In-valid user id`, { cause: 404 }))
    } else {
        return res.status(200).json({ message: 'Done', wishlist: user.wishlist })
    }

})