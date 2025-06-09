import { Router } from "express";
import auth from "../../middleware/authentication.js";
import { endPoint } from "../auth/auth.endPoint.js";
import userModel from "../../../DB/model/user.model.js";
import * as user_controller from './controller/user.js'

const router = Router()




router.get('/getUserById', auth(endPoint.profile),async (req, res) => {
    const user = await userModel.findById(req.user._id).populate("wishlist")

    res.json({ message: 'Done',  user})
})


router.get('/getWishlist', auth(endPoint.profile), user_controller.getWishlist)


export default router