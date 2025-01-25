import orderModel from "../../../../DB/model/order.model.js";
import reviewModel from "../../../../DB/model/review.model.js";
import { asyncHandler } from "../../../services/handelError.js";




export const addReview = asyncHandler(async (req, res, next) => {

    const { productId } = req.params
    const { _id } = req.user
    const { comment, rating } = req.body

    const checkReview = await reviewModel.findOne({ createdBy: _id, productId })
    if (checkReview) {
        return next(new Error(`already reviewed`, { cause: 409 }))
    }

    const checkOrder = await orderModel.findOne({
        userId: _id,
        "products.productId": productId,
        status: 'received'
    })

    if (!checkOrder) {
        return next(new Error(`cannot review product before you get it.`, { cause: 404 }))
    }

    const review = await reviewModel.create({
        comment,
        rating,
        createdBy: _id,
        productId
    })

    return res.status(201).json({ message: "Done", review })
})


export const updateReview = asyncHandler(async (req, res, next) => {

    const { productId, id } = req.params
    const { comment, rating } = req.body

    const review = await reviewModel.findOneAndUpdate(
        {
            _id: id,
            productId,
            createdBy: req.user._id
        },
        {
            comment, rating
        }, { new: true })

    if (review) {
        return res.status(200).json({ message: "Done", review })
    } else {
        return res.status(200).json({ message: "fail to update", review })
    }

})