/* I have read and understood the sections of plagiarism in the College Policy on assessment offences
 and confirm that the work is my own, with the work of others clearly acknowledged. 
 I give my permission to submit my report to the plagiarism testing database that the College
is using and test it using plagiarism detection software, search engines or meta-searching software. */

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