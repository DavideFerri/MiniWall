const mongoose = require('mongoose')
const LikeSchema = mongoose.Schema({
    userID:{type:String,
            required:true},
    postID:{type:String,
        required:true},
    datestamp:{type:Date,
        required:true}   
})

module.exports = mongoose.model('likes',LikeSchema)