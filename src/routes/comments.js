const express = require('express')
const router = express.Router()
const Comment = require('../models/Comments')
const verify = require('../validations/verifyToken')
const Post = require('../models/Posts')
const {commentValidation} = require('../validations/validation')

router.get('/',verify,async(req,res)=>{
    
    // get postID hack - ask Alessio how to do this
    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/comments"))

    try{
        const getComments = await Comment.find({"postID":postID})
        res.send(getComments)
    }
    catch(err){
        res.send({message:err})
    }
})

router.post('/',verify,async(req,res)=>{
    
    // get postID hack - ask Alessio how to do this
    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/comments"))
    const post = await Post.findById(postID)

    const {error} = commentValidation(req.body)

    if (post.userID == req.user._id){
        res.send({message:"You cannot comment your own posts"})
        return 
    }

    const commentData = new Comment(
        {
        userID: req.user._id,
        postID: postID,
        text: req.body.text,
        datestamp: Date.now()}
    )

    try{
        const commentToSave = await commentData.save()
        res.send(commentToSave)
    }catch(err){
        res.send({message:err})
    }
})

router.get('/:commentID',verify,async(req,res)=>{

    // get postID hack - ask Alessio how to do this
    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/comments"))

    try{
        const getComment = await Comment.findById(req.params.commentID)

        if (postID != getComment.postID){
            res.send({message:"post ID in URL and comment post ID do not match"})
        }
        else{
        res.send(getComment)}
    }
    catch(err){
        res.send({message:err})
    }
})

router.put('/:commentID',verify,async(req,res)=>{
    
    // get postID hack - ask Alessio how to do this
    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/comments"))
    const post = await Post.findById(postID)
    const comment = await Comment.findById(req.params.commentID)

    if (post.userID == req.user._id){
        res.send({message:"You cannot comment your own posts"})
        return 
    }
    if (postID != comment.postID){
        res.send({message:"post ID in URL and comment post ID do not match"})
        return
    }
    if (req.user._id != comment.userID){
        res.send({message:"You cannot modify other users' comments"})
        return
    }

    const {error} = commentValidation(req.body)

    try{
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
        res.send({message:err})
    }
})

router.delete('/:commentID',verify,async(req,res)=>{
    
    // get postID hack - ask Alessio how to do this
    const postID = req.baseUrl.substring(7, req.baseUrl.lastIndexOf("/comments"))
    const post = await Post.findById(postID)
    const comment = await Comment.findById(req.params.commentID)

    if (post.userID == req.user._id){
        res.send({message:"You cannot comment your own posts"})
        return 
    }
    if (postID != comment.postID){
        res.send({message:"post ID in URL and comment post ID do not match"})
        return
    }
    if (req.user._id != comment.userID){
        res.send({message:"You cannot delete other users' comments"})
        return
    }

    try{
        const deleteComment = await Comment.deleteOne({
            _id:req.params.commentID
        })
        res.send(deleteComment)
    }catch(err){
        res.send({message:err})
    }

})

module.exports = router