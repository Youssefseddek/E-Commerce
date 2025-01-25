import { Router } from "express";
import auth from "../../middleware/authentication.js";
import { endPoint } from "./order.endPoint.js";
import * as order_controller from './controller/order.js'

const router = Router()


router.post('/add', auth(endPoint.add), order_controller.addOrder)




export default router



