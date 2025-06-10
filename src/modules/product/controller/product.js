import slugify from "slugify"
import { asyncHandler } from "../../../services/handelError.js"
import subCategoryModel from "../../../../DB/model/subCategory.model.js"
import brandModel from "../../../../DB/model/brand.model.js"
import cloudinary from "../../../services/cloudinary.js"
import productModel from "../../../../DB/model/product.model.js"




// add product
export const addProduct = asyncHandler(async (req, res, next) => {

    if (!req.files?.length) {
        next(new Error('Images is required', { cause: 400 }))
    } else {

        const { name, amount, price, discount, subCategoryId, categoryId, brandId } = req.body

        req.body.slug = slugify(name)
        req.body.stock = amount


        req.body.finalPrice = price - (price * ((discount || 0) / 100))

        // category and sub category
        const category = await subCategoryModel.findOne({ _id: subCategoryId, categoryId })
        if (!category) {
            return next(new Error('In-valid category or subcategory IDs', { cause: 404 }))
        }

        // brand
        const brand = await brandModel.findOne({ _id: brandId })
        if (!brand) {
            return next(new Error('In-valid brand ID', { cause: 404 }))
        }

        const images = []
        const publicImageIds = []
        for (const file of req.files) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `E-commerce/product/${name}` })
            images.push(secure_url)
            publicImageIds.push(public_id)
        }

        req.body.images = images
        req.body.publicImageIds = publicImageIds
        req.body.createdBy = req.user._id

        const product = await productModel.create(req.body)
        if (product) {
            return res.status(201).json({ message: "Done", product })
        } else {

            for (const imageID of req.body.publicImageIds) {
                await cloudinary.uploader.destroy(imageID)

            }
            return res.status(400).json({ message: "Fail to create", })

        }



    }
})



// update product 
export const updateProduct = asyncHandler(async (req, res, next) => {

    const { id } = req.params
    const product = await productModel.findById(id)
    if (!product) {
        next(new Error('In-valid product Id', { cause: 404 }))
    } else {
        const { name, amount, price, discount, categoryId, subCategoryId, brandId } = req.body
        if (name) {
            req.body.slug = slugify(name)
        }


        if (amount) {
            const calckStok = amount - product.soldCount
            calckStok > 0 ? req.body.stock = calckStok : req.body.stock = 0
        }

        //calc final  price
        if (price && discount) {
            req.body.finalPrice = price - (price * (discount / 100))
        } else if (price) {
            req.body.finalPrice = price - (price * (product.discount / 100))
        } else if (discount) {
            req.body.finalPrice = product.price - (product.price * (discount / 100))
        }

        // category and sub category
        if (categoryId && subCategoryId) {
            const category = await subCategoryModel.findOne({ _id: subCategoryId, categoryId })
            if (!category) {
                return next(new Error('In-valid category or subcategory IDs', { cause: 404 }))
            }
        }

        // brand
        if (brandId) {
            const brand = await brandModel.findOne({ _id: brandId })
            if (!brand) {
                return next(new Error('In-valid brand ID', { cause: 404 }))
            }
        }

        //images
        if (req.files?.length) {
            const images = []
            const publicImageIds = []
            for (const file of req.files) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `E-commerce/product/${name}` })
                images.push(secure_url)
                publicImageIds.push(public_id)
            }

            req.body.images = images
            req.body.publicImageIds = publicImageIds
        }


        req.body.updatedBy = req.user._id

        const updateProduct = await productModel.findOneAndUpdate({ _id: id }, req.body)

        if (updateProduct) {
            if (req.files?.length) {
                for (const imageId of product.publicImageIds) {
                    await cloudinary.uploader.destroy(imageId)
                }
            }
            res.status(200).json({ message: "Done", updateProduct })

        } else {
            if (req.files?.length) {
                for (const imageId of req.body.publicImageIds) {
                    await cloudinary.uploader.destroy(imageId)
                }
            }
            return next(new Error("Fail to update", { cause: 400 }))
        }


    }
})


// get product
export const getAllProducts = asyncHandler(async (req, res, next) => {

    const productList = await productModel.find().populate([
        {
            path: 'createdBy',
            select: 'userName email'
        },
        {
            path: 'updatedBy',
            select: 'userName email'
        },
        {
            path: 'subCategoryId',
            select: 'name image',
            populate: {
                path: 'categoryId',
                select: 'name image',
            }
        },
        {
            path: 'brandId',
            select: 'name image'
        },
        {
            path: 'review'
        }
    ])


    const finlProducts = []
    for (const product of productList) {
        let sumRating = 0
        // console.log(productList[i].review.length);

        for (let i = 0; i < product.review.length; i++) {
            sumRating += product.review[i].rating
            console.log(product.review[i].rating);

        }

        const convObj = product.toObject()
        convObj.Rating = sumRating / product.review.length
        finlProducts.push(convObj)
    }

    return res.status(200).json({ message: "Done", finlProducts })
})


// search product by name
export const searchProductByName = asyncHandler(async (req, res, next) => {
    const { searchKey } = req.query
    console.log(searchKey);

    const product = await productModel.find({ "name": new RegExp('.*' + searchKey + '.*') }).populate([
        {
            path: 'createdBy',
            select: 'userName email'
        },
        {
            path: 'updatedBy',
            select: 'userName email'
        },
        {
            path: 'subCategoryId',
            select: 'name image',
            populate: {
                path: 'categoryId',
                select: 'name image',
            }
        },
        {
            path: 'brandId',
            select: 'name image'
        },
    ])

    return res.status(200).json({ message: "Done", product })
}) 


// get product by id
export const getAllProductById = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const product = await productModel.findById(id).populate([
        {
            path: 'createdBy',
            select: 'userName email'
        },
        {
            path: 'updatedBy',
            select: 'userName email'
        },
        {
            path: 'subCategoryId',
            select: 'name image',
            populate: {
                path: 'categoryId',
                select: 'name image',
            }
        },
        {
            path: 'brandId',
            select: 'name image'
        },

    ])
    if (!product) {
        return next(new Error('In-valid product Id', { cause: 404 }))
    }

    return res.status(200).json({ message: "Done", product })
}
)






// delete product
export const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const product = await productModel.findById(id)
    if (!product) {
        return next(new Error('In-valid product Id', { cause: 404 }))
    } else {
        for (const imageId of product.publicImageIds) {
            await cloudinary.uploader.destroy(imageId)
        }
        const deletedProduct = await productModel.findByIdAndDelete(id)
        return res.status(200).json({ message: "Done", deletedProduct })
    }
})