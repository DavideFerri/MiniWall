const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')

const bodyParser = require('body-parser')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const postsRoute = require('./routes/posts')
const likeRoute = require('./routes/likes')
const commentsRoute = require('./routes/comments')
const authRoute = require('./routes/auth')

app.use(bodyParser.json())
app.use('/posts',postsRoute)
app.use('/user',authRoute)
app.use('/posts/:postId/likes',likeRoute)
app.use('/posts/:postId/comments',commentsRoute)

app.get('/', (req,res) => {
    res.send('Welcome to MiniWall!')
})
mongoose.connect(process.env.DB_CONNECTOR,()=>{
    console.log('DB is now connected')
})

app.listen(3000,()=> {
    console.log('Server is up and running')
})
