const express = require('express')
const router = express.Router()

const User = require('../models/User')
const {registerValidation,loginValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

router.post('/register',async(req,res)=>{
    const {error} = registerValidation(req.body)
    if(error){res.status(400).send(error)}
    else{
        try{
        const salt = await bcryptjs.genSalt(5)
        const hashedPassword = await bcryptjs.hash(req.body.password,salt)
        const user = new User({...req.body,password:hashedPassword})
        const savedUser = await user.save()
        res.send(savedUser)}
        catch(err){res.status(500).send({message:err})}
    }
})

router.post('/login',async(req,res)=>{
    const {error} = loginValidation(req.body)
    if(error){return res.status(400)}
    const user = await User.findOne({email:req.body.email})
    if (!user){
        return res.status(400).send({message:'incorrect credentials'})
    }
    const passwordValidation = await bcryptjs.compare(req.body.password,user.password)
    if (!passwordValidation){
        return res.status(400).send({message:'incorrect credentials'})
    }
    try{
        const token = jsonwebtoken.sign({_id:user._id},process.env.TOKEN_SECRET)
        res.header('auth-token',token).send({'auth-token':token})
    }
    catch(err){res.status(500).send({message:err})}
}
)

module.exports = router