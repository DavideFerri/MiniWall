// import modules
const joi = require('joi')

// validations
const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username:joi.string().required().min(3).max(256),
        email:joi.string().required().min(3).max(256).email(),
        password : joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email:joi.string().required().min(3).max(256).email(),
        password : joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

const postValidation = (data) => {
    const postValidation = joi.object({
        title: joi.string().required().min(1).max(64),
        text : joi.string().required().min(1).max(1024) // don't allow posts to be too long
    })
    return postValidation.validate(data)
}

const commentValidation = (data) => {
    const commentValidation = joi.object({
        text : joi.string().required().min(1).max(1024) // don't allow comments to be too long
    })
    return commentValidation.validate(data)
}

// export all validations
module.exports = {registerValidation, loginValidation, postValidation, commentValidation}