import { Router } from "express";
import auth from "../../middleware/authentication.js";
import { endPoint } from "./order.endPoint.js";
import * as order_controller from './controller/order.js'
import express from 'express'

const router = Router()


router.post('/add', auth(endPoint.add), order_controller.addOrder)





router.post('/webhook', express.raw({type: 'application/json'}),order_controller.webhook);




export default router



