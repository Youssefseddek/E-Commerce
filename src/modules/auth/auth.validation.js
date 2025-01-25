import joi from 'joi'


export const signup = {
    body: joi.object().required().keys({
        userName: joi.string().pattern(new RegExp(/[a-zA-Z\u0621-\u064Aء-ئ][^#&<>\"~;$^%{}?]{2,20}$/)).min(2).max(20).required().messages({
            'any.required': 'Plz enter your username',
            'string.base': 'Only char is acceptable',
        }),

        email: joi.string().email().required()
        ,
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required()
        ,
        cPassword: joi.string().valid(joi.ref('password')).required()
    })
}



export const login = {
    body: joi.object().required().keys({
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required()
    })
}

export const token = {
    params: joi.object().required().keys({
        token: joi.string().required(),
    })
}


export const sendCode = {
    body: joi.object().required().keys({
        email: joi.string().email({ minDomainSegments: 1, tlds: { allow: ['com', 'net'] } }).required().messages({
            "any.required": "PLZ enter your email",
            "string.empty": "email can not be empty",
            "string.email": " enter valid email ",
            "string.base": " enter valid email "
        })
    })
}


export const forgetPassword = {
    body: joi.object().required().keys({
        email: joi.string().email({ minDomainSegments: 1, tlds: { allow: ['com', 'net'] } }).required().messages({
            "any.required": "PLZ enter your email",
            "string.empty": "email can not be empty",
            "string.email": " enter valid email ",
            "string.base": " enter valid email "
        }),
        code: joi.string().required(),
        newPassword: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/)).required()

    })
}