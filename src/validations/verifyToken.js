// import modules
const jsonwebtoken = require('jsonwebtoken')

function auth(req,res,next){
    const token = req.header('auth-token')
    if(!token){
        // token is necessary for auth
        return res.status(401).send({message:'Access denied'})
    }
    try{
        // check token validity
        const verified = jsonwebtoken.verify(token,process.env.TOKEN_SECRET)
        req.user = verified
        next()
    }
    catch(err){return res.status(401).send({message:'Access denied'})}
}

module.exports = auth