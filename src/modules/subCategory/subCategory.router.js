import { Router } from "express";
import { endPoint } from "./subCategory.endPoint.js";
import { myMulter, validationTypes } from "../../services/cloudMulter.js";
import * as subCategory_controller from './controller/subCategory.js'
import auth from "../../middleware/authentication.js";


const router = Router({mergeParams:true})


// router.get('/',(req,res)=>{
//     console.log({url:req.originalUrl});
//     console.log({pp:req.params});
    
//     res.json({message:'Done'})
// })

// add sub category
router.post('/', auth(endPoint.add), myMulter(validationTypes.image).single('image'), subCategory_controller.addSubCategory)


// update sub category
router.put('/:id', auth(endPoint.update), myMulter(validationTypes.image).single('image'), subCategory_controller.updateSubCategory)


// get all sub categories
router.get('/', subCategory_controller.getAllSubCategories)


router.get('/:id', subCategory_controller.getSubCategoryById)


export default router