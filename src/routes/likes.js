const express = require('express')
const router = express.Router()
const Like = require('../models/Likes')
const verify = require('../validations/verifyToken')
const Post = require('../models/Posts')

router.get('/',verify,async(req,res)=>{
    
    // get postID hack - ask Alessio how to do this
    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/likes"))

    try{
        const getLikes = await Like.find({"postID":postID})
        res.send(getLikes)
    }
    catch(err){
        res.send({message:err})
    }
})

router.post('/',verify,async(req,res)=>{
    
    // get postID hack - ask Alessio how to do this
    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/likes"))
    const post = await Post.findById(postID)

    likeExists = await Like.exists({"userID": req.user._id,"postID":postID})
    if(likeExists){
        res.send({message:"You have already liked this post"})
        return}
    if (post.userID == req.user._id){
        res.send({message:"You cannot like your own posts"})
        return 
    }

    const likeData = new Like(
        {
        userID: req.user._id,
        postID: postID,
        datestamp: Date.now()}
    )

    try{
        const likeToSave = await likeData.save()
        res.send(likeToSave)
    }catch(err){
        res.send({message:err})
    }
})

router.delete('/',verify,async(req,res)=>{

    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/likes"))
    
    try{
        const deleteLike = await Like.deleteOne({
            "userID":req.user._id,
            "postID":postID
        })
        res.send(deleteLike)
    }catch(err){
        res.send({message:err})
    }
    
})

module.exports = router