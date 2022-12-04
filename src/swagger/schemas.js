// import modules
const m2s = require('mongoose-to-swagger');

// import models
const Post = require('../models/Posts')
const User = require('../models/User')
const Like = require('../models/Likes')
const Comment = require('../models/Comments')

//swagger models
const User_s = m2s(User)
const Like_s = m2s(Like)
const Comment_s = m2s(Comment)
const Post_s = m2s(Post)

// export
module.exports = {User_s,Post_s,Comment_s,Like_s}
