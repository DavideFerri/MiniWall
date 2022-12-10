/* I have read and understood the sections of plagiarism in the College Policy on assessment offences
 and confirm that the work is my own, with the work of others clearly acknowledged. 
 I give my permission to submit my report to the plagiarism testing database that the College
is using and test it using plagiarism detection software, search engines or meta-searching software. */

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