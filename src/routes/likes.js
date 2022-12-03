// import modules
const express = require('express')
const router = express.Router()

// import models
const Like = require('../models/Likes')
const Post = require('../models/Posts')

// import validations
const verify = require('../validations/verifyToken')

// endpoints
router.get('/',verify,async(req,res)=>{
    
    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/likes"))
    try{
        const getLikes = await Like.find({"postID":postID})
        res.send(getLikes)
    }
    catch(err){
        res.status(500).send({message:err})
    }
})

router.post('/',verify,async(req,res)=>{
    
    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/likes"))
    const post = await Post.findById(postID)

    // cannot like the same post more than once
    likeExists = await Like.exists({"userID": req.user._id,"postID":postID})
    if(likeExists){
        res.status(400).send({message:"You have already liked this post"})
        return
    }
    // cannot like your own posts
    if (post.userID == req.user._id){
        res.status(400).send({message:"You cannot like your own posts"})
        return 
    }
    try{
        // save like
        const likeData = new Like({
            userID: req.user._id,
            postID: postID,
            datestamp: Date.now()
        })
        const likeToSave = await likeData.save()
        res.send(likeToSave)
    }catch(err){
        res.status(500).send({message:err})
    }
})

router.delete('/',verify,async(req,res)=>{

    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/likes"))

    try{
        // delete like
        const deleteLike = await Like.deleteOne({
            "userID":req.user._id,
            "postID":postID
        })
        res.send(deleteLike)
    }catch(err){res.status(500).send({message:err})}
})

module.exports = router