import mongoose from "mongoose";



const reviewSchema = new mongoose.Schema({

    comment: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },



}, {
    timestamps: true,
})



const reviewModel = mongoose.model('Review', reviewSchema)
export default reviewModel