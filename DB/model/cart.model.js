import mongoose from "mongoose";



const cartSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: [true, "Only one cart ber each user"],
        required: true
    },

    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            required: true
        }
    }]

}, {
    timestamps: true,
})



const cartModel = mongoose.model('Cart', cartSchema)
export default cartModel