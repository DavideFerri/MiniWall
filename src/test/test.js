/* I have read and understood the sections of plagiarism in the College Policy on assessment offences
 and confirm that the work is my own, with the work of others clearly acknowledged. 
 I give my permission to submit my report to the plagiarism testing database that the College
is using and test it using plagiarism detection software, search engines or meta-searching software. */

const server = require("../app")
const request = require('supertest');

const Post = require("../models/Posts")
const User = require("../models/User")
const Comment = require("../models/Comments")
const Like = require("../models/Likes")

const users = [
    {
        email: "olga@gmail.com",
        username: "olga",
        password: "123456"
    },
    {
        email: "nick@gmail.com",
        username: "nick",
        password: "234567"
    },
    {
        email: "mary@gmail.com",
        username: "mary",
        password: "345678"
    }
]

describe("UAT", ()=>{

    beforeAll(async ()=>{
        // reset db collections upon each test execution
        await User.deleteMany({})
        await Post.deleteMany({})
        await Comment.deleteMany({})
        await Like.deleteMany({})
    })
    afterAll((done)=>{
        // shutdown the server
        server.close((err) => {
            done(err)
        })
    })

    test("TC1",async ()=>{
        // register all users
        await Promise.all(users.map( async user=>{
            await request('http://localhost:3000').post('/user/register').send({"username": user.username,
                                                                                "email": user.email,
                                                                                "password": user.password}).expect(200)
        }))  
    })
    
    test("TC2", async ()=>{
        // login users
        await Promise.all(users.map(async user=>{
            const res = await request('http://localhost:3000').post('/user/login').send({
                                                                                            "email": user.email,
                                                                                            "password": user.password
                                                                                        })
            expect(res.body['auth-token']).toBeTruthy();
            // store token for each user
            user.token = res.body['auth-token'];
        }))  
    })

    test("TC3",async ()=>{
        // call API without token
        const res = await request('http://localhost:3000').get('/posts')
        expect(res.statusCode).toEqual(401);
    })

    test("TC4", async ()=>{
        
        // Olga creates post
        const olga = users[0]
        const res = await request('http://localhost:3000').post('/posts').set("auth-token", olga.token)
            .send({title: 'Just woke up happy',
                    text: "Hello, how are all my friends today? I feel happy"})
        olga.postID = res.body._id
        expect(res.statusCode).toEqual(200);
     })

     test("TC5", async ()=>{

        // Nick creates post
        const nick = users[1]
        const res = await request('http://localhost:3000').post('/posts').set("auth-token", nick.token)
            .send({
                title: 'Just woke up sad',
                text: "Hello, how are all my friends today? I feel sad"
            })
        nick.postID = res.body._id
        expect(res.statusCode).toEqual(200);
     })

     test("TC6", async ()=>{

        // Mary creates post
        const mary = users[2]
        const res = await request('http://localhost:3000').post('/posts').set("auth-token", mary.token).send({
                title: 'Just woke up mini',
                text: "Hello, how are all my friends today? I feel mini"
            })
        mary.postID = res.body._id
        expect(res.statusCode).toEqual(200);
     })

    test("TC7", async ()=>{

        // Olga sees all posts in chronological order
        const olga = users[0]
        const res = await request('http://localhost:3000').get('/posts').set("auth-token", olga.token)
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(3)
        expect(new Date(res.body[0].datestamp) > new Date(res.body[1].datestamp)).toBeTruthy()
        expect(new Date(res.body[0].datestamp) > new Date(res.body[2].datestamp)).toBeTruthy()
        
        // Nick sees all posts in chronological order
        const nick = users[1]
        const res2 = await request('http://localhost:3000').get('/posts').set("auth-token", nick.token)
        expect(res2.statusCode).toEqual(200);
        expect(res2.body.length).toEqual(3)
        expect(new Date(res2.body[0].datestamp) > new Date(res2.body[1].datestamp)).toBeTruthy()
        expect(new Date(res2.body[0].datestamp) > new Date(res2.body[2].datestamp)).toBeTruthy()
    })

    test("TC8", async ()=>{
        
        const olga = users[0]
        const nick = users[1]
        const mary = users[2]
        
        // Olga comments Mary's post
        const res = await request('http://localhost:3000').post(`/posts/${mary.postID}/comments`)
            .send({"text": 'Hi Mary, I feel happy today!'}).set("auth-token", olga.token)
        expect(res.statusCode).toEqual(200);

        // Nick comments Mary's post
        const res2 = await request('http://localhost:3000').post(`/posts/${mary.postID}/comments`)
            .send({"text": 'Hi Mary, I feel sad today!'}).set("auth-token", nick.token)
        expect(res2.statusCode).toEqual(200);
    })

    test("TC9",async ()=>{

        const mary = users[2]
        // Mary cannot comment her own posts
        const res = await request('http://localhost:3000').post(`/posts/${mary.postID}/comments`)
            .send({"text": 'Hi Mary, I feel mini today!'}).set("auth-token", mary.token)
        expect(res.statusCode).toEqual(400);
    })

    test("TC10",async ()=>{

        const mary = users[2]
        const res = await request('http://localhost:3000').get('/posts').set("auth-token", mary.token)
        // Mary can see the posts in chronological order
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(3);
        expect(new Date(res.body[0].datestamp) > new Date(res.body[1].datestamp)).toBeTruthy();
        expect(new Date(res.body[1].datestamp) > new Date(res.body[2].datestamp)).toBeTruthy();
    })

    test("TC11",async ()=>{
        
        const mary = users[2]
        // Mary can see the comments to her post
        const res = await request('http://localhost:3000').get(`/posts/${mary.postID}/comments`).set("auth-token", mary.token)
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(2);
    })

    test("TC12", async ()=>{
        const olga = users[0]
        const nick = users[1]
        const mary = users[2]

        // Olga likes Mary's post
        const res = await request('http://localhost:3000').post(`/posts/${mary.postID}/likes`).set("auth-token", olga.token)
        expect(res.statusCode).toEqual(200);

        // Nick likes Mary's post
        const res2 = await request('http://localhost:3000').post(`/posts/${mary.postID}/likes`).set("auth-token", nick.token)
        expect(res2.statusCode).toEqual(200);
    })

    test("TC13",async ()=>{

        const mary = users[2]
        // Mary cannot like her own post
        const res = await request('http://localhost:3000').post(`/posts/${mary.postID}/likes`).set("auth-token", mary.token)
        expect(res.statusCode).toEqual(400);
    })

    test("TC14",async ()=>{
        
        const mary = users[2]
        // Mary can see that her post has two likes
        const res = await request('http://localhost:3000').get(`/posts/${mary.postID}/likes`).set("auth-token", mary.token)
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(2);
    })

    test("TC15", async ()=>{

        const nick = users[1]
        const mary = users[2]
        // Nick can see the list of posts
        const res = await request('http://localhost:3000').get(`/posts`).set("auth-token", nick.token)
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(3);
        // Mary's post is at the top having 2 likes
        expect(res.body[0]._id).toEqual(mary.postID);
        // All other in chronological order
        expect(new Date(res.body[1].datestamp) > new Date(res.body[2].datestamp)).toBeTruthy();

    })
})