import slugify from "slugify"
import brandModel from "../../../../DB/model/brand.model.js"
import cloudinary from "../../../services/cloudinary.js"
import { asyncHandler } from "../../../services/handelError.js"







// add brand
export const addBrand = asyncHandler(async (req, res, next) => {

    if (!req.file) {
        next(new Error('Image is required', { cause: 400 }))
    } else {

        const { name } = req.body
        if (await brandModel.findOne({ name })) {
            return next(new Error(`Duplicated brand name ${name}`, { cause: 409 }))
        }
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'E-commerce/brand' })

        const brand = await brandModel.create({
            name,
            slug: slugify(name),
            image: secure_url,
            imagePublicId: public_id,
            createdBy: req.user._id
        })
        console.log({ brand });

        if (brand) {
            return res.status(201).json({ message: 'Done', brand })
        } else {
            await cloudinary.uploader.destroy(public_id)
            return next(new Error('fail to add brand', { cause: 400 }))
        }


    }
})


// update brand
export const updateBrand = asyncHandler(
    async (req, res, next) => {

        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'E-commerce/brand' })
            req.body.image = secure_url,
                req.body.imagePublicId = public_id
        }
        const { id } = req.params
        console.log(id);

        const { name } = req.body
        if (name) {
            req.body.slug = slugify(name)
        }

        req.body.updatedBy = req.user._id
        console.log(req.body);

        const brand = await brandModel.findOneAndUpdate({ _id: id }, req.body)


        console.log({ brand });


        if (brand) {
            if (req.file) {
                await cloudinary.uploader.destroy(brand.imagePublicId)
            }
            return res.status(201).json({ message: 'Done', brand })
        } else {

            if (req.file) {
                await cloudinary.uploader.destroy(req.body.imagePublicId)
            }

            return next(new Error('fail to update brand', { cause: 400 }))
        }


    })



// get brand
export const getAllBrands = asyncHandler(async (req, res, next) => {

    const brandList = await brandModel.find().populate([
        {
            path: 'createdBy',
            select: 'userName email'
        }
    ])

    return res.status(200).json({ message: "Done", brandList })
})
