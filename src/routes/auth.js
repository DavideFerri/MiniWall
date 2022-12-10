/* I have read and understood the sections of plagiarism in the College Policy on assessment offences
 and confirm that the work is my own, with the work of others clearly acknowledged. 
 I give my permission to submit my report to the plagiarism testing database that the College
is using and test it using plagiarism detection software, search engines or meta-searching software. */

// import modules
const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

// import models
const User = require('../models/User')
// import validation functions
const {registerValidation,loginValidation} = require('../validations/validation')

// endpoints
router.post('/register',async(req,res)=>{
    const {error} = registerValidation(req.body)
    if(error){
        res.status(400).send(error)
    }
    else{
        try{
            // encrypt password
            const salt = await bcryptjs.genSalt(5)
            const hashedPassword = await bcryptjs.hash(req.body.password,salt)
            // return data
            const user = new User({...req.body,password:hashedPassword})
            const savedUser = await user.save()
            res.send(savedUser)}
            catch(err){res.status(500).send({message:err})
        }
    }
})

router.post('/login',async(req,res)=>{
    const {error} = loginValidation(req.body)
    if(error){
        return res.status(400).send(error)
    }
    // validate user and password
    const user = await User.findOne({email:req.body.email})
    if (!user){
        return res.status(400).send({message:'incorrect credentials'})
    }
    const passwordValidation = await bcryptjs.compare(req.body.password,user.password)
    if (!passwordValidation){
        return res.status(400).send({message:'incorrect credentials'})
    }
    try{
        // generate and return token
        const token = jsonwebtoken.sign({_id:user._id},process.env.TOKEN_SECRET)
        res.header('auth-token',token).send({'auth-token':token})
    }
    catch(err){res.status(500).send({message:err})}
}
)

module.exports = router