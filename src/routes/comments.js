// import modules
const express = require('express')
const router = express.Router()

// import models
const Comment = require('../models/Comments')
const Post = require('../models/Posts')

// import validations
const verify = require('../validations/verifyToken')
const {commentValidation} = require('../validations/validation')

// endpoints
router.get('/',verify,async(req,res)=>{
    
    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/comments"))
    try{
        const getComments = await Comment.find({"postID":postID})
        res.send(getComments)
    }
    catch(err){
        res.status(500).send({message:err})
    }
})

router.post('/',verify,async(req,res)=>{
    
    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/comments"))
    const post = await Post.findById(postID)

    const {error} = commentValidation(req.body)
    if(error){
        res.status(400).send({message:error})
    }
    // cannot comment your own posts
    if (post.userID == req.user._id){
        res.status(400).send({message:"You cannot comment your own posts"})
        return 
    }
    try{
        // save comment
        const commentData = new Comment({
            userID: req.user._id,
            postID: postID,
            text: req.body.text,
            datestamp: Date.now()
        })
        const commentToSave = await commentData.save()
        res.send(commentToSave)
    }catch(err){
        res.status(500).send({message:err})
    }
})

router.get('/:commentID',verify,async(req,res)=>{

    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/comments"))
    try{
        const getComment = await Comment.findById(req.params.commentID)
        // check post ID matches URL
        if (postID != getComment.postID){
            res.status(400).send({message:"post ID in URL and comment post ID do not match"})
            return
        }
        res.send(getComment)
    }
    catch(err){
        res.status(500).send({message:err})
    }
})

router.put('/:commentID',verify,async(req,res)=>{
    
    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/comments"))
    const post = await Post.findById(postID)
    const comment = await Comment.findById(req.params.commentID)

    // cannot comment own posts
    if (post.userID == req.user._id){
        res.status(400).send({message:"You cannot comment your own posts"})
        return 
    }
    // check post ID matches URL
    if (postID != comment.postID){
        res.status(400).send({message:"post ID in URL and comment post ID do not match"})
        return
    }
    // cannot modify other users' comments
    if (req.user._id != comment.userID){
        res.status(400).send({message:"You cannot modify other users' comments"})
        return
    }

    const {error} = commentValidation(req.body)
    if(error){
        res.status(400).send({message:error})
    }

    try{
        // update comment
        const commentToSave = await Comment.updateOne(
            {_id:req.params.commentID},
            {$set:{
                userID:comment.userID,
                postID:comment.postID,
                text:req.body.text,
                datestamp: Date.now()}
            }
        )
        res.send(commentToSave)
    }catch(err){
        res.status(500).send({message:err})
    }
})

router.delete('/:commentID',verify,async(req,res)=>{
    
    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/comments"))
    const post = await Post.findById(postID)
    const comment = await Comment.findById(req.params.commentID)
    // cannot comment own posts
    if (post.userID == req.user._id){
        res.status(400).send({message:"You cannot comment your own posts"})
        return 
    }
    // check post ID matches URL
    if (postID != comment.postID){
        res.status(400).send({message:"post ID in URL and comment post ID do not match"})
        return
    }
    // cannot modify other users' comments
    if (req.user._id != comment.userID){
        res.status(400).send({message:"You cannot delete other users' comments"})
        return
    }
    try{
        // delete comment
        const deleteComment = await Comment.deleteOne({
            _id:req.params.commentID
        })
        res.send(deleteComment)
    }catch(err){
        res.status(500).send({message:err})
    }
})

module.exports = router