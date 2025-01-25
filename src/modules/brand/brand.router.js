import { Router } from "express";
import { endPoint } from "./brand.endPoint.js";
import { myMulter, validationTypes } from "../../services/cloudMulter.js";
import * as brand_controller from './controller/brand.js'
import auth from "../../middleware/authentication.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './brand.validation.js'


const router = Router()





// add brand
router.post('/add', auth(endPoint.add), myMulter(validationTypes.image).single('image'), brand_controller.addBrand)


// update brand
router.put('/:id', auth(endPoint.update), myMulter(validationTypes.image).single('image'), brand_controller.updateBrand)


// get brand
router.get('/', brand_controller.getAllBrands)




export default router