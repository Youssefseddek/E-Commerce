import productModel from "../../../../DB/model/product.model.js";
import userModel from "../../../../DB/model/user.model.js";
import { asyncHandler } from "../../../services/handelError.js";




export const addToWishlist = asyncHandler(async (req, res, next) => {

    const { productId } = req.params
    const product = await productModel.findOne({ _id: productId })
    if (!product) {
        return next(new Error(`In-valid product id`, { cause: 404 }))
    } else {
        const wishlist = await userModel.findByIdAndUpdate(req.user._id,
            {
                $addToSet: { wishlist: productId }
            }, { new: true }
        )

        return res.status(200).json({ message: 'Done', wishlist })
    }


})


export const removeToWishlist = asyncHandler(async (req, res, next) => {

    const { productId } = req.params
    const product = await productModel.findOne({ _id: productId })
    if (!product) {
        return next(new Error(`In-valid product id`, { cause: 404 }))
    } else {
        const wishlist = await userModel.findByIdAndUpdate(req.user._id,
            {
                $pull: { wishlist: productId }
            }, { new: true }
        )
        return res.status(200).json({ message: 'Done', wishlist })

    }

})