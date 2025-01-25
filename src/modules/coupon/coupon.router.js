import { Router } from "express";
import auth from "../../middleware/authentication.js";
import { endPoint } from "./coupon.endPoint.js";
import * as coupon_controller from './controller/coupon.js'



const router = Router()





// get coupon
router.get('/', auth(endPoint.get), coupon_controller.getCoupon)


// add coupon
router.post('/', auth(endPoint.add), coupon_controller.addCoupon)


// update coupon
router.put('/:id', auth(endPoint.update), coupon_controller.updateCoupon)

// delete coupon
router.delete('/:id', auth(endPoint.delete), coupon_controller.deleteCoupon)





export default router