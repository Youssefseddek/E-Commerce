import couponModel from "../../../../DB/model/coupon.model.js"
import { asyncHandler } from "../../../services/handelError.js"



// get coupon
export const getCoupon = asyncHandler(async (req, res, next) => {

    const couponList = await couponModel.find({})
    return res.status(200).json({ message: "Done", couponList })

})


// add coupon
export const addCoupon = asyncHandler(async (req, res, next) => {

    const findCoupon = await couponModel.findOne({ name: req.body.name })
    if (findCoupon) {
        next(new Error(`Duplicated coupon name ${req.body.name}`, { cause: 400 }))
    } else {
        req.body.createdBy = req.user._id
        const coupon = await couponModel.create(req.body)

        return res.status(201).json({ message: 'Done', coupon })
    }

})


// update coupon
export const updateCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const findCoupon = await couponModel.findOne({ name: req.body.name })
    if (findCoupon) {
        next(new Error(`Duplicated coupon name ${req.body.name}`, { cause: 400 }))
    } else {
        req.body.updateBy = req.user._id
        const updateCoupon = await couponModel.findOneAndUpdate({ _id: id }, req.body, { new: true })

        return updateCoupon ?
            res.status(200).json({ message: 'Done', updateCoupon })
            : next(new Error('In-valid coupon Id', { cause: 404 }))
    }

})


// delete coupon
export const deleteCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const deleteCoupon = await couponModel.findOneAndDelete({ _id: id })

    return deleteCoupon ?
        res.status(200).json({ message: 'Done', deleteCoupon })
        : next(new Error('In-valid coupon Id', { cause: 404 }))


})