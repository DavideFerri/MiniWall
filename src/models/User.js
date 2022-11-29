const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {username: {
        type:String,
        required:true,
        min:3,
        max:26,
        unique:true
    },
    email: {
        type:String,
        required:true,
        min:3,
        max:226,
        unique:true
    },
    password: {
        type:String,
        required:true,
        min:3,
        max:1024
    },
    date: {
        type:Date,
        default:Date.now
    }}
)

module.exports = mongoose.model('users',userSchema)