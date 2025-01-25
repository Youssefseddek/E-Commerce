import mongoose from "mongoose";



const orderSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User",unique:false, required: true },
   
   
    products: [{
        name: { type: String, required: true },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            required: true
        },
        unitPrice: {
            type: Number,
            default: 1,
            required: true
        },
        finalPrice: {
            type: Number,
            default: 1,
            required: true
        }
    }],

    address: { type: String, required: [true, "address is required"] },
    phone: { type: String, required: [true, "phone is required"] },
    paymentMethod: {
        type: String,
        default: "cash",
        enum: ['cash', 'card']
    },
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    sumTotal: {
        type: Number,
        default: 1
    },
    finalPrice: {
        type: Number,
        default: 1,
        required: true
    },
    status: {
        type: String,
        default: "placed",
        enum: ['placed', 'received', 'rejected', 'onWay']
    }

}, {
    timestamps: true,
})



const orderModel = mongoose.model('Order', orderSchema)
export default orderModel