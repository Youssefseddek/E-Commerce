import cartModel from "../../../../DB/model/cart.model.js";
import productModel from "../../../../DB/model/product.model.js";
import { asyncHandler } from "../../../services/handelError.js";




export const addToCart = asyncHandler(async (req, res, next) => {

    const { productId, quantity } = req.body

    const product = await productModel.findOne({
        _id: productId,
        stock: { $gte: quantity }
    })

    if (!product) {
        return next(new Error(`In-valid product max available  stock is :${product?.stock}`, { cause: 400 }))
    }

    const cart = await cartModel.findOne({ userId: req.user._id })
    if (!cart) {
        const newCart = await cartModel.create({
            userId: req.user._id,
            products: [{ productId, quantity }]
        })

        return res.status(201).json({ message: "Done", cart: newCart })
    }


    let matchProduct = false
    for (const product of cart.products) {
        if (product.productId.toString() == productId) {
            product.quantity = quantity
            matchProduct = true
            break
        }
    }

    if (!matchProduct) {
        cart.products.push({ productId, quantity })
    }


    console.log({cart});
    await cart.save()

    return res.status(201).json({ message: "Done", cart })
    
})

export const removeFromCart = asyncHandler(async (req, res, next) => {

    const { productId } = req.body

    const cart = await cartModel.findOneAndUpdate({userId:req.user._id},
        {
            $pull:{
                products:{
                //    productId :{$in:[productId]}
                   productId 
                }
            }
        },{new:true}
    )
    
    return res.status(200).json({ message: "Done", cart })
})


export const clearCart = asyncHandler(async (req, res, next) => {


    const cart = await cartModel.findOneAndUpdate({userId:req.user._id},
        {
            products:[]
        },{new:true}
    )
    
    return res.status(200).json({ message: "Done", cart })
})


export const getCart = asyncHandler(async (req, res, next) => {

    const cart = await cartModel.findOne({ userId: req.user._id }).populate({})
    if (!cart) {
        return next(new Error("In-valid cart", { cause: 404 }))
    }
    return res.status(200).json({ message: "Done", cart })
})