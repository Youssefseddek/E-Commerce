import { Router } from "express";
import auth from "../../middleware/authentication.js";
import { endPoint } from "../brand/brand.endPoint.js";
import { HME, myMulter, validationTypes } from "../../services/cloudMulter.js";
import * as product_controller from './controller/product.js'
import wishlistRouter from '../wishlist/wishlist.router.js'
import reviewRouter from '../review/review.router.js'

const router = Router()

router.use('/:productId/wishlist',wishlistRouter)
router.use('/:productId/review',reviewRouter)

// add product
router.post('/', auth(endPoint.add), myMulter(validationTypes.image).array('images',5), product_controller.addProduct)


// update product
router.put('/:id', auth(endPoint.update), myMulter(validationTypes.image).array('images',5), product_controller.updateProduct)


// get product
router.get('/',product_controller.getAllProducts)


// get product by id
router.get('/:id',product_controller.getAllProductById)


// search product by name
router.get('/search',product_controller.getAllProductById)


export default router