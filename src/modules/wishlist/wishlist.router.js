import { Router } from "express";
import auth from "../../middleware/authentication.js";
import { endPoint } from "./wishlist.endPoint.js";
import * as wishlist_controller from './controller/wishlist.js'


const router = Router({ mergeParams: true })


router.patch('/add', auth(endPoint.add), wishlist_controller.addToWishlist)


router.patch('/remove', auth(endPoint.remove), wishlist_controller.removeToWishlist)





export default router