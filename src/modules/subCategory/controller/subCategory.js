import slugify from "slugify"
import categoryModel from "../../../../DB/model/category.model.js"
import subCategoryModel from "../../../../DB/model/subCategory.model.js"
import cloudinary from "../../../services/cloudinary.js"
import { asyncHandler } from "../../../services/handelError.js"
import { pagination } from "../../../services/pagination.js"






// add sub category
export const addSubCategory = asyncHandler(async (req, res, next) => {

    if (!req.file) {
        return next(new Error('Image is required', { cause: 400 }))
    } else {

        const { categoryId } = req.params
        const { name } = req.body

        const category = await categoryModel.findOne({ _id: categoryId })

        if (await subCategoryModel.findOne({ name })) {
            return next(new Error(`Duplicated subCategory name ${name}`, { cause: 409 }))
        }

        if (!category) {
            return next(new Error('Image is required', { cause: 400 }))
        } else {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `E-commerce/category/${category._id}` })

            const subCategory = await subCategoryModel.create({
                name,
                slug: slugify(name),
                image: secure_url,
                imagePublicId: public_id,
                createdBy: req.user._id,
                categoryId: category._id
            })
            console.log({ subCategory });

            if (subCategory) {
                return res.status(201).json({ message: 'Done', subCategory })
            } else {
                await cloudinary.uploader.destroy(public_id)
                return next(new Error('fail to add sub category', { cause: 400 }))
            }
        }

    }
})



// update sub category
export const updateSubCategory = asyncHandler(async (req, res, next) => {

    const { categoryId } = req.params
    const { id } = req.params
    const { name } = req.body

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            { folder: `E-commerce/category/${categoryId}` })
        req.body.image = secure_url,
            req.body.imagePublicId = public_id
    }

    if (name) {
        req.body.slug = slugify(name)
    }

    req.body.updatedBy = req.user._id
    console.log({ body: req.body });

    const subCategory = await subCategoryModel.findOneAndUpdate({ _id: id, categoryId }, req.body)

    if (subCategory) {
        if (req.file) {
            await cloudinary.uploader.destroy(subCategory.imagePublicId)
        }
        return res.status(201).json({ message: 'Done', subCategory })
    } else {
        if (req.file) {
            await cloudinary.uploader.destroy(req.body.imagePublicId)
        }
        return next(new Error('fail to update category', { cause: 400 }))
    }


})


// get all sub categories
export const getAllSubCategories = asyncHandler(async (req, res, next) => {


    const subCategoryList = await subCategoryModel.find().populate([
        {
            path: 'createdBy',
            select: 'userName email image'
        },
        {
            path: 'updatedBy',
            select: 'userName email image'
        },
        {
            path: 'categoryId',
            select: 'name image '
        }
    ])



    return res.status(200).json({ message: 'Done', subCategoryList })
})




// get sub category by Id
export const getSubCategoryById = asyncHandler(async (req, res, next) => {

    const { id } = req.params

    const subCategory = await subCategoryModel.findOne({ _id: id }).populate([
        {
            path: 'createdBy',
            select: 'userName email image'
        },
        {
            path: 'updatedBy',
            select: 'userName email image'
        },
        {
            path: 'categoryId',
            select: 'userName email image'
        }
    ])

    return res.status(200).json({ message: 'Done', subCategory })
})