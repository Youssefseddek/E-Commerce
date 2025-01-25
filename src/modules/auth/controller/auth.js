import userModel from "../../../../DB/model/user.model.js"
import { hashFunction } from "../../../services/hashFunction.js"
import { myEmail } from "../../../services/sendEmail.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { asyncHandler } from "../../../services/handelError.js"
import { nanoid } from "nanoid"


export const signUp = asyncHandler(async (req, res, next) => {

    const { userName, email, password } = req.body

    const user = await userModel.findOne({ email }).select('email')
    if (user) {
        return next(Error('Email Exist', { cause: 409 }))
    } else {
        //hashPassword
        const hash = hashFunction(password)

        const newUser = new userModel({ userName, email, password: hash })
        // send email
        const token = jwt.sign({ id: newUser._id }, process.env.tokenEmailSignature, { expiresIn: '1h' })
        const link = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmEmail/${token}`

        const message = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="${process.env.logo}">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
    <tr>
    <td>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <a href="" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Request new  esmail </a>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`
        const info = await myEmail(email, 'Confirmation Email', message)

        if (info.accepted.length) {
            const savedUser = await newUser.save()
            return res.status(200).json({ message: 'Done', userID: savedUser._id })
        } else {
            // res.status(400).json({ message: 'please provide real email' })
            return next(Error('please provide real email', { cause: 400 }))
        }
    }

})



export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params

    const decoded = jwt.verify(token, process.env.tokenEmailSignature)
    if (!decoded?.id) {
        return next(new Error('In-valid token payload', { cause: 400 }))
    } else {
        const user = await userModel.updateOne({ _id: decoded.id, confirmEmail: false },
            { confirmEmail: true }, { new: true }
        )

        return user.modifiedCount ?
            // res.status(200).redirect({ message: 'Done email confirmed', user }) :
            res.status(200).json({ message: 'Done email confirmed', user }) :
            next(new Error('Already confirmed', { cause: 400 }))
    }

})





export const signIn = asyncHandler(
    async (req, res, next) => {

        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return next(new Error('Email Not Exist', { cause: 404 }))
        } else {
            //Compare Password
            const match = bcrypt.compareSync(password, user.password)
            if (!match) {
                return next(new Error('In-valid Password', { cause: 404 }))
            } else {
                if (!user.confirmEmail) {
                    return next(new Error('Confirm your email first', { cause: 400 }))
                } else {
                    if (user.blocked) {
                        return next(new Error('Blocked User', { cause: 400 }))
                    } else {
                        const token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.tokenSignature,
                            { expiresIn: 60 * 60 * 24 })

                        return res.status(200).json({ message: 'Done', token, user })
                    }
                }
            }

        }

    }
)




export const sendCode = asyncHandler(async (req, res, next) => {

    const { email } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
        return next(Error('not resgister user', { cause: 404 }))
    } else {

        const accessCode = nanoid()

        await userModel.findByIdAndUpdate(user._id,
            { code: accessCode }, { new: true }
        )

        myEmail(user.email, 'access code', `<h1> access code :${accessCode}</h1>`)
        return res.json({ message: 'Done check your email ', accessCode })
    }

})



export const forgetPassword = asyncHandler(async (req, res, next) => {


    const { email, code, newPassword } = req.body

    if (code == null) {
        return next(Error("Account dosn't require forget password yet !", { cause: 404 }))
    } else {
        const user = await userModel.findOne({ email, code })
        if (!user) {
            return next(Error("In-valid account or In-valid OTP code", { cause: 404 }))
        } else {
            const hashPassword = hashFunction(newPassword)
            await userModel.updateOne({ _id: user._id }, { code: null, password: hashPassword })
            return res.json({ message: 'Done ' })
        }
    }

})