import { Router } from "express";
import auth from "../../middleware/authentication.js";
import { endPoint } from "./cart.endPoint.js";
import * as cart_controller from './controller/cart.js'

const router = Router()


router.post('/add', auth(endPoint.add), cart_controller.addToCart)


router.patch('/remove', auth(endPoint.remove), cart_controller.removeFromCart)


router.patch('/clear', auth(endPoint.clear), cart_controller.clearCart)


export default router



