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