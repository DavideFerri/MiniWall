/* I have read and understood the sections of plagiarism in the College Policy on assessment offences
 and confirm that the work is my own, with the work of others clearly acknowledged. 
 I give my permission to submit my report to the plagiarism testing database that the College
is using and test it using plagiarism detection software, search engines or meta-searching software. */

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
