import mongoose from "mongoose";



const productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'name must be unique value'],
        required: [true, 'name is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase: true,
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'slug is required'],
    },
    description: { type: String, trim: true },
    colors: [String],
    size: {
        type: [String],
        enum: ['s', 'm', 'lg', 'xl','xxl', 'xxxl'],
    },

    images: {
        type: [String],
        required: [true, 'images is required'],
    },
    publicImageIds: [String],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'can not at category without owner']
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    stock: {
        type: Number,
        default: 0,
        required: [true, 'Start-stock is required'],
    },
    amount: {
        type: Number,
        default: 0
    }
    ,
    soldCount: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    discount: {
        default: 0,
        type: Number
    },
    finalPrice: {
        type: Number,
        required: [true, 'FinalPrice is required'],
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'categoryId is required'],
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: [true, 'subCategoryId is required'],
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: [true, 'brandId is required'],
    },

    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})


productSchema.virtual('review', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'productId'
})



const productModel = mongoose.model('Product', productSchema)
export default productModel