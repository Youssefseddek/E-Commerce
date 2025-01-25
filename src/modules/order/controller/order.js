import Stripe from "stripe";
import cartModel from "../../../../DB/model/cart.model.js";
import couponModel from "../../../../DB/model/coupon.model.js";
import orderModel from "../../../../DB/model/order.model.js";
import productModel from "../../../../DB/model/product.model.js";
import { asyncHandler } from "../../../services/handelError.js";
import payment from "../../../services/payment.js";



export const addOrder = asyncHandler(async (req, res, next) => {

    const { couponName } = req.body


    if (!req.body.products) {

        const cart = await cartModel.findOne({ userId: req.user._id })
        if (!cart.products?.length) {
            return next(new Error(`empty cart`, { cause: 400 }))
        }
        req.body.isCart = true
        req.body.products = cart.products
    }

    let sumTotal = 0
    const finalList = []
    const productsIds = []

    for (let product of req.body.products) {
        const checkProduct = await productModel.findOne(
            {
                _id: product.productId,
                stock: { $gte: product.quantity }
            }
        )
        if (!checkProduct) {
            return next(new Error("In-valid to place this order", { cause: 409 }))
        }

        productsIds.push(product.productId)
        product = req.body.isCart ? product.toObject() : product
        product.name = checkProduct.name
        product.unitPrice = checkProduct.finalPrice
        product.finalPrice = checkProduct.finalPrice * product.quantity

        sumTotal += product.finalPrice
        finalList.push(product)

    }

    req.body.sumTotal = sumTotal
    req.body.finalPrice = sumTotal

    if (couponName) {
        const checkCoupon = await couponModel.findOne({ name: couponName, usedBy: { $nin: req.user._id } })
        if (!checkCoupon) {
            return next(new Error("In-valid coupon", { cause: 409 }))
        }
        req.body.coupon = checkCoupon
        req.body.couponId = checkCoupon._id
        req.body.finalPrice = sumTotal - (sumTotal * (checkCoupon.amount / 100))
    }


    req.body.userId = req.user._id
    req.body.products = finalList

    const order = await orderModel.create(req.body)

    if (order) {
        if (couponName) {
            await couponModel.findOneAndUpdate({ name: couponName }, { $addToSet: { usedBy: req.user._id } })

        }
        if (req.body.isCart) {
            const cart = await cartModel.findOneAndUpdate({ userId: req.user._id },
                {
                    $pull: {
                        products: {
                            productId: { $in: productsIds }

                        }
                    }
                }, { new: true }
            )
        }
        console.log({ order });

        // payment
        if (order.paymentMethod == "card") {
            const stripe = new Stripe(process.env.STRIPE_KEY)

            if (req.body.coupon) {
                const coupon = await stripe.coupons.create({ percent_off: req.body.coupon.amount, duration: 'once' })
                console.log(coupon);
                req.body.coupon_id = coupon.id
            }

            const session = await payment({
                stripe,
                payment_method_types: ['card'],
                mode: 'payment',
                customer_email: req.user.email,
                metadata: {
                    orderId: order._id.toString()
                },
                cancel_url: `${process.env.CANCEL_URL}${order._id.toString()}`,
                line_items: order.products.map(product => {
                    return {
                        price_data: {
                            currency: 'egp',
                            product_data: {
                                name: product.name
                            },
                            unit_amount: product.unitPrice * 100
                        },
                        quantity: product.quantity
                    }
                }),

                discounts: req.body.coupon_id ? [{ coupon: req.body.coupon_id }] : []
            })

            return res.status(201).json({ message: "Done", order, session, url: session.url })
        } else {
            return res.status(201).json({ message: "Done", order })
        }
    } else {
        return next(new Error("Fail to place your order", { cause: 400 }))

    }



})









export const webhook = asyncHandler(async (req, res) => {
    
    let event;

    const stripe = new Stripe(process, env.STRIPE_KEY)
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.endpointSecret
        );
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
    }

    const { orderId } = event.data.object.metadata
    // Handle the event 
    if (event.type != 'checkout.session.completed') {

        await orderModel.updateOne({ _id: orderId }, { status: "rejected" })
        return res.status(400).json({ message: 'Rejected Order' });
    }
    await orderModel.updateOne({ _id: orderId }, { status: "received" })

    // Return a 200 res to acknowledge receipt of the event
    return res.status(200).json({ message: 'received Order' });
})