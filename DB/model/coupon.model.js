import mongoose from "mongoose";



const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'name must be unique value'],
        required: [true, 'name is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase: true,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'can not at category without owner']
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        default: 1,
        max: [100, "max is 100%"],
        min: [1, "min is 1%"]
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    usedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    expireDate: String

}, {
    timestamps: true,
})



const couponModel = mongoose.model('Coupon', couponSchema)
export default couponModel