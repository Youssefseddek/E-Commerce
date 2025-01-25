import { Router } from "express";
import * as auth_controller from './controller/auth.js'
import { validation } from "../../middleware/validation.js";
import * as validators from './auth.validation.js'
const router = Router()



// Sign Up
router.post('/signup', validation(validators.signup), auth_controller.signUp)


//Confirm Email
router.get('/confirmEmail/:token', auth_controller.confirmEmail)


// Sign In
router.post('/signin', validation(validators.login), auth_controller.signIn)


// - Forget password
router.patch('/sendcode', validation(validators.sendCode), auth_controller.sendCode)
router.patch('/forgetpassword', validation(validators.forgetPassword), auth_controller.forgetPassword)

export default router