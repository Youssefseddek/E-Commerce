import mongoose from "mongoose";



const subCategorySchema = new mongoose.Schema({
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
        required: [true, 'can not add subCategory without owner']
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'can not add subCategory without Category']
    }
}, {
    timestamps: true
})


const subCategoryModel = mongoose.model('SubCategory', subCategorySchema)
export default subCategoryModel