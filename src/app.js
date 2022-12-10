
/* I have read and understood the sections of plagiarism in the College Policy on assessment offences
 and confirm that the work is my own, with the work of others clearly acknowledged. 
 I give my permission to submit my report to the plagiarism testing database that the College
is using and test it using plagiarism detection software, search engines or meta-searching software. */

// import modules
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

// import swagger
const swaggerOptions = require("./swagger/swagger-config")

// point to routes
const postsRoute = require('./routes/posts')
const likeRoute = require('./routes/likes')
const commentsRoute = require('./routes/comments')
const authRoute = require('./routes/auth')
  
const specs = swaggerJsdoc(swaggerOptions);
app.use(
"/api-docs",
swaggerUi.serve,
swaggerUi.setup(specs)
);

// relate routes to endpoints
app.use(bodyParser.json())
app.use('/posts',postsRoute)
app.use('/user',authRoute)
app.use('/posts/:postId/likes',likeRoute)
app.use('/posts/:postId/comments',commentsRoute)

// start and welcome
app.get('/', (req,res) => {
    res.send('Welcome to MiniWall!')
})

mongoose.connect(process.env.DB_CONNECTOR,()=>{
    console.log('DB is now connected')
})

const http_server = app.listen(3000,()=> {
    console.log('Server is up and running')
})

module.exports = http_server
