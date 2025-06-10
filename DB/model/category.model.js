import mongoose from "mongoose";



const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'name must be unique value'],
        required: [true, 'name is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase: true
    },
    slug: {
        type: String,
        required: [true, 'slug is required'],
    },

    image: String,
    imagePublicId: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'can not at category without owner']
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true}
})


categorySchema.virtual('subCategory',{
    ref:'SubCategory',
    localField:'_id',
    foreignField:'categoryId'
})



categorySchema.virtual('products', {
    ref: 'Product',           // The model to use
    localField: '_id',        // Find products where `categoryId`
    foreignField: 'categoryId'// is equal to the category's `_id`
})



const categoryModel = mongoose.model('Category', categorySchema)
export default categoryModel