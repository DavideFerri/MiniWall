const mongoose = require('mongoose')
const PostSchema = mongoose.Schema({
    userID:{type:String,
            required:true},
    title:{type:String,
        required:true},
    text:{type:String,
        required:true},
    datestamp:{type:Date,
        required:true}
})

module.exports = mongoose.model('posts',PostSchema)