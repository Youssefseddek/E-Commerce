import { Router } from "express";
import auth from "../../middleware/authentication.js";
import { endPoint } from "./category.endPoint.js";
import * as category_controller from './controller/category.js'
import { myMulter, validationTypes } from "../../services/cloudMulter.js";
import subCategory from '../subCategory/subCategory.router.js'

const router = Router()

router.use('/:categoryId/subcategory',subCategory)

// add category
router.post('/', auth(endPoint.add), myMulter(validationTypes.image).single('image'), category_controller.addCategory)


// update category
router.put('/:id', auth(endPoint.update), myMulter(validationTypes.image).single('image'), category_controller.updateCategory)


// get all categories
router.get('/', category_controller.getAllCategories)


// get category by Id
router.get('/:id', category_controller.getCategoryById)

// delete

export default router
