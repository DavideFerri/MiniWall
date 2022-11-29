const express = require('express')
const router = express.Router()
const Post = require('../models/Posts')
const User = require('../models/User')
const verify = require('../validations/verifyToken')
const {postValidation} = require('../validations/validation')
const Like = require('../models/Likes')

router.post('/',verify,async(req,res)=>{
    const {error} = postValidation(req.body)
    const postData = new Post(
        {
        userID: req.user._id,
        title:req.body.title,
        text:req.body.text,
        datestamp: Date.now()}
    )
    try{
        const postToSave = await postData.save()
        res.send(postToSave)
    }catch(err){
        res.send({message:err})
    }
})

router.get('/',verify,async(req,res)=>{
    try{
        let getPosts = await Post.aggregate([
            // Stage 1: get likes in post
            { "$addFields": { "postID": { "$toString": "$_id" }}},
            { "$lookup": {"from": "likes","localField": "postID","foreignField": "postID","as": "likes"}},
            // Stage 2: count likes
            {$project: { userID: 1,title: 1,text: 1,datestamp: 1,__v: 1,numberOfLikes: { $size: "$likes" }}},
            // Stage 3: order by 
            { $sort : { numberOfLikes : -1, datestamp: -1}},
            // Stage 4: keep only posts fields
            // TODO: understand how to specify default inclusion of post fields
            {$project: { userID: 1,title: 1,text: 1,datestamp: 1,__v: 1}}
        ]);
        res.send(getPosts)
    }
    catch(err){
        res.send({message:err})
    }
})

router.get('/:postId',verify,async(req,res)=>{
    try{
        const getPosts = await Post.findById(req.params.postId)
        res.send(getPosts)
    }
    catch(err){
        res.send({message:err})
    }
})

router.put('/:postId',verify,async(req,res)=>{
    
    const post = await Post.findById(req.params.postId)
    if(post.userID != req.user._id){
        res.send({message:"Your user and post user don't match."})
    }
    else{
        const {error} = postValidation(req.body)
        try{
            const postToSave = await Post.updateOne(
                {_id:req.params.postId},
                {$set:{
                    userID:post.userID,
                    title:req.body.title,
                    text:req.body.text,
                    datestamp: Date.now()}
                }
            )
            res.send(postToSave)
        }catch(err){
            res.send({message:err})
        }
    }
})

router.delete('/:postId',verify,async(req,res)=>{

    const post = await Post.findById(req.params.postId)
    if(post.userID != req.user._id){
        res.send({message:"Your user and post user don't match."})
    }
    else{
        try{
            const deletePostbyID = await Post.deleteOne({
                _id:req.params.postId
            })
            res.send(deletePostbyID)
        }catch(err){
            res.send({message:err})
        }
    }
})

module.exports = router