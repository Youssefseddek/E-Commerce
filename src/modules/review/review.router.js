import { Router } from "express";
import { endPoint } from "./review.endPoint.js";
import * as review_controller from './controller/review.js'
import auth from "../../middleware/authentication.js";

const router = Router({ mergeParams: true })



router.post('/add', auth(endPoint.add), review_controller.addReview)

router.put('/update/:id', auth(endPoint.update), review_controller.updateReview)



export default router



