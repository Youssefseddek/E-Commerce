import categoryModel from "../../../../DB/model/category.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/handelError.js";
import slugify from "slugify";
import { pagination } from "../../../services/pagination.js";
import subCategoryModel from "../../../../DB/model/subCategory.model.js";


// add category
export const addCategory = asyncHandler(async (req, res, next) => {

    if (!req.file) {
        next(new Error('Image is required', { cause: 400 }))
    } else {
        const { name } = req.body
        if (await categoryModel.findOne({name})) {
            return next(new Error(`Duplicated category name ${name}`, { cause: 409 }))
         } 
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'E-commerce/category' })

        const category = await categoryModel.create({
            name,
            slug: slugify(name),
            image: secure_url,
            imagePublicId: public_id,
            createdBy: req.user._id
        })
        console.log({ category });

        if (category) {
            return res.status(201).json({ message: 'Done', category })
        } else {
            await cloudinary.uploader.destroy(public_id)
            return next(new Error('fail to add category', { cause: 400 }))
        }


    }
})


// update category
export const updateCategory = asyncHandler(async (req, res, next) => {

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'E-commerce/category' })
        req.body.image = secure_url,
            req.body.imagePublicId = public_id
    }
    const { id } = req.params
    const { name } = req.body
    if (name) {
        req.body.slug = slugify(name)
    }

    req.body.updatedBy = req.user._id
    console.log(req.body);

    const category = await categoryModel.findOneAndUpdate({ _id: id }, req.body)




    if (category) {
        if (req.file) {
            await cloudinary.uploader.destroy(category.imagePublicId)
        }
        return res.status(201).json({ message: 'Done', category })
    } else {
        await cloudinary.uploader.destroy(req.body.imagePublicId)
        return next(new Error('fail to update category', { cause: 400 }))
    }


})


// get all categories
export const getAllCategories = asyncHandler(async (req, res, next) => {

    const { page, size } = req.query
    const { skip, limit } = pagination(page, size)
    const categoryList = await categoryModel.find().skip(skip).limit(limit).populate([
        {
            path: 'createdBy',
            select: 'userName email image'
        },
        {
            path: 'updatedBy',
            select: 'userName email image'
        },
        {
            path: 'subCategory',
            select: 'name image'
        }
    ])

    // const categories =[]
    //     for await (const doc of categoryModel.find().skip(skip).limit(limit).populate([
    //         {
    //             path: 'createdBy',
    //             select: 'userName email image'
    //         },
    //         {
    //             path: 'updatedBy',
    //             select: 'userName email image'
    //         }
    //     ])) {
    //         console.log(doc); // Prints documents one at a time

    //         const subCat = await subCategoryModel.find({ categoryId: doc._id })
    //         console.log(subCat); 

    //         const conObj = doc.toObject()
    //         conObj.subCategories = subCat
    //         categories.push(conObj)
    //     }

    return res.status(200).json({ message: 'Done', categoryList })
})


// get category by Id
export const getCategoryById = asyncHandler(async (req, res, next) => {

    const { id } = req.params
    const category = await categoryModel.findOne({ _id: id }).populate([
        {
            path: 'createdBy',
            select: 'userName email image'
        },
        {
            path: 'updatedBy',
            select: 'userName email image'
        }
    ])

    return res.status(200).json({ message: 'Done', category })
})