import jwt from 'jsonwebtoken'
import userModel from '../../DB/model/user.model.js'
import { asyncHandler } from '../services/handelError.js'

export const roles = {
    User: 'User',
    Admin: 'Admin',
    HR: 'HR'
}

const auth = (accessRoles = []) => {
    return asyncHandler(async (req, res, next) => {

        const { authorization } = req.headers

        if (!authorization.startsWith(process.env.BearerKey)) {
            return next(Error('In-valid Bearer key', { cause: 400 }))
        } else {
            const token = authorization.split(process.env.BearerKey)[1]
            const decoded = jwt.verify(token, process.env.tokenSignature)
            console.log({ decoded });

            if (!decoded || !decoded.id || !decoded.isLoggedIn) {
                return next(Error('In-valid token pay load', { cause: 400 }))
            } else {
                const user = await userModel.findById(decoded.id).select(' userName email role ')
                if (!user) {
                    return next(Error("user doesn't exist ", { cause: 401 }))
                } else {
                    console.log(accessRoles);
                    
                    if (!accessRoles.includes(user.role)) {
                        return next(Error("not auth user ", { cause: 403 }))
                    } else {
                        req.user = user
                        next()
                    }
                }
            }
        }

    })
}


export default auth