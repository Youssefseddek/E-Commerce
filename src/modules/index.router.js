import express, { urlencoded } from 'express'
import authRouer from './auth/auth.router.js'
import userRouter from './user/user.router.js'
import productRouter from './product/product.router.js'
import categoryRouter from './category/category.router.js'
import brandRouter from './brand/brand.router.js'
import couponRouter from './coupon/coupon.router.js'
import cartRouter from './cart/cart.router.js'
import orderRouter from './order/order.router.js'
import morgan from 'morgan'
import { globalErrorHandling } from '../services/handelError.js'
import connectDB from '../../DB/connection.js'
import cors from 'cors'



export const appRouter = (app) => {


    // convert buffer data
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    //setup cors
    app.use(cors({}))

    // morgan check response
    if (process.env.MOOD === 'DEV') {
        app.use(morgan('dev'))
    } else {
        app.use(morgan('combined'))
    }

    //Base URL
    const baseUrl = process.env.BASE_URL

    // setup API Routing
    app.use(`${baseUrl}/auth`, authRouer)
    app.use(`${baseUrl}/user`, userRouter)
    app.use(`${baseUrl}/product`, productRouter)
    app.use(`${baseUrl}/category`, categoryRouter)
    app.use(`${baseUrl}/brand`, brandRouter)
    app.use(`${baseUrl}/coupon`, couponRouter)
    app.use(`${baseUrl}/cart`, cartRouter)
    app.use(`${baseUrl}/order`, orderRouter)
    app.get('*', (req, res) => res.send('In-valid Routing Please check url  or  method'))

    //Error Handling
    app.use(globalErrorHandling)

    //connectionDB
    connectDB()
}