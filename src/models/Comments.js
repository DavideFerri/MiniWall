/* I have read and understood the sections of plagiarism in the College Policy on assessment offences
 and confirm that the work is my own, with the work of others clearly acknowledged. 
 I give my permission to submit my report to the plagiarism testing database that the College
is using and test it using plagiarism detection software, search engines or meta-searching software. */

const mongoose = require('mongoose')
const CommentSchema = mongoose.Schema({
    userID:{type:String,
            required:true},
    postID:{type:String,
        required:true},
    text:{type:String,
        required:true},
    datestamp:{type:Date,
        required:true}    
})

module.exports = mongoose.model('comments',CommentSchema)