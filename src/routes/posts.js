/* I have read and understood the sections of plagiarism in the College Policy on assessment offences
 and confirm that the work is my own, with the work of others clearly acknowledged. 
 I give my permission to submit my report to the plagiarism testing database that the College
is using and test it using plagiarism detection software, search engines or meta-searching software. */

// import modules
const express = require('express')
const router = express.Router()

// import models
const Post = require('../models/Posts')
const User = require('../models/User')
const Like = require('../models/Likes')

// import validations
const verify = require('../validations/verifyToken')
const {postValidation} = require('../validations/validation')

// endpoints
router.post('/',verify,async(req,res)=>{
    const {error} = postValidation(req.body)
    if(error){
        res.status(400).send({message:error})
    }
    try{
        // create post and save
        const postData = new Post({
            userID: req.user._id,
            title:req.body.title,
            text:req.body.text,
            datestamp: Date.now()
        })
        const postToSave = await postData.save()
        res.send(postToSave)
    }catch(err){
        res.status(500).send({message:err})
    }
})

router.get('/',verify,async(req,res)=>{
    try{
        let getPosts = await Post.aggregate([
            // Stage 1: get likes
            { "$addFields": { "postID": { "$toString": "$_id" }}},
            { "$lookup": {"from": "likes","localField": "postID","foreignField": "postID","as": "likes"}},
            // Stage 2: count likes
            {$project: { userID: 1,title: 1,text: 1,datestamp: 1,__v: 1,numberOfLikes: { $size: "$likes" }}},
            // Stage 3: order by likes and datestamp 
            { $sort : { numberOfLikes : -1, datestamp: -1}},
            // Stage 4: keep only fields of interest
            {$project: { userID: 1,title: 1,text: 1,datestamp: 1,__v: 1}}
        ]);
        res.send(getPosts)
    }
    catch(err){
        res.status(500).send({message:err})
    }
})

router.get('/:postId',verify,async(req,res)=>{
    try{
        const getPosts = await Post.findById(req.params.postId)
        res.send(getPosts)
    }
    catch(err){
        res.status(500).send({message:err})
    }
})

router.put('/:postId',verify,async(req,res)=>{
    
    const post = await Post.findById(req.params.postId)
    // one can change only their own posts
    if(post.userID != req.user._id){
        res.status(400).send({message:"Your user and post user don't match."})
    }
    else{
        const {error} = postValidation(req.body)
        if(error){
            res.status(400).send({message:error})
        }
        try{
            // update post
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
            res.status(500).send({message:err})
        }
    }
})

router.delete('/:postId',verify,async(req,res)=>{

    const post = await Post.findById(req.params.postId)
    // one can delete only their own posts
    if(post.userID != req.user._id){
        res.status(400).send({message:"Your user and post user don't match."})
    }
    else{
        try{
            // delete post
            const deletePostbyID = await Post.deleteOne({_id:req.params.postId})
            res.send(deletePostbyID)
        }catch(err){
            res.status(500).send({message:err})
        }
    }
})

module.exports = router