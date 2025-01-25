import mongoose from "mongoose";
import { roles } from "../../src/middleware/authentication.js";



const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length is 2 char'],
        max: [20, 'maximum length is 20 char'],
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email must be unique value']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        enum: [roles.Admin, roles.User, roles.HR],
        default: 'User'
    },
    active: {
        type: Boolean,
        default: false
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    blocked: {
        type: Boolean,
        default: false
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    image: String,
    DOB: String,
    code:String
}, {
    timestamps: true
})


const userModel = mongoose.model('User', userSchema)
export default userModel