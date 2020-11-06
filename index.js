const express = require('express')
const app = express()
require("dotenv").config()
const mongoose = require('mongoose')
const moment = require('moment')
const port = process.env.PORT || 3100
const passportSetup = require('./config/passportSetup')
const passport = require('passport')
const cookieSession = require('cookie-session')
const requestModel = require('./models/requestModel')
const allPostModel = require('./models/allPostsModel')
const profileModel = require('./models/profileModel')
const projectModel = require('./models/projectModel')

app.use(cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}))

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("I am connect")
        app.listen(port, () => {
            console.log(`listening at http://localhost:${port}/`)
        })
    })
    .catch(err => console.log(err))

app.get('/feed', (req, res) => {
    allPostModel.find()
        .sort('-createdAt')
        .then((result) => {
            let allPosts = result
            res.status(200).render('index', { allPosts, moment })
        })
})

app.get('/newPost', (req, res) => {
    requestModel.find()
    .sort('-createdAt')
        .then((result) => {
            let allRequests = result
            res.status(200).render('newPost', { allRequests, moment })
        })
})

app.post('/new', (req, res) => {
    const newRequest = new requestModel({
        type: 'request',
        title: req.body.title,
        author: req.user.firstName,
        author_url: req.user.picture,
        request: req.body.request,
        category: req.body.category
    }).save()
    const newPost = new allPostModel({
        type: 'request',
        title: req.body.title,
        author: req.user.firstName,
        author_url: req.user.picture,
        request: req.body.request,
        category: req.body.category
    }).save()
        .then(() => {
            console.log("I am saved")
            res.status(201).redirect('/newPost')
        })
})

/*  !!!!!!!!!!!Yahya!!!!!!!!! */
app.get('/profiles', (req, res) => {
    profileModel.find()
        .then((result) => {
            res.status(200).render('profiles', { profiles: result })
        })


})

app.get('/newProject', (req, res) => {
    projectModel.find()
        .sort('-createdAt')
        .catch(err => console.log(err))
        .then((result) => {
            res.status(200).render('newProject', { projects: result })
        })
})


app.post('/addProject', (req, res) => {
    const newProject = new projectModel({
        type: 'project',
        title: req.body.title,
        author: req.user.firstName,
        author_url: req.user.picture,
        project_img: req.body.project_img,
        project_url: req.body.project_url,
        github_url: req.body.github_url,
        request: req.body.request
    }).save()
    const newPost = new allPostModel({
        type: 'project',
        title: req.body.title,
        author: req.user.firstName,
        author_url: req.user.picture,
        project_img: req.body.project_img,
        project_url: req.body.project_url,
        github_url: req.body.github_url,
        request: req.body.request
    }).save()
        .then(() => {
            console.log("I am saved")
            res.status(201).redirect('/newProject')
        })
})

app.post('/newFeedComment/:id', (req, res) => {
    allPostModel.findById(req.params.id)
        .then((result) => {
            if (result.comments === undefined) {
                let comments = [req.body]
                comments.author = req.user.firstName
                comments.author_url = req.user.picture
                allPostModel.findByIdAndUpdate({ _id: req.params.id }, { comments: comments }, { useFindAndModify: false })
                    .catch(err => console.log(err))
                    .then(() => {
                        console.log(" All updated")
                        requestModel.findOneAndUpdate({ request: result.request }, { comments: comments }, { useFindAndModify: false })
                            .catch(err => console.log(err))
                            .then(() => {
                                console.log(" Single updated")
                            })
                    })
            } else {
                let comments = result.comments
                let newComment = req.body
                newComment.author = req.user.firstName
                newComment.author_url = req.user.picture
                comments.push(newComment)
                allPostModel.findByIdAndUpdate({ _id: req.params.id }, { comments: comments }, { useFindAndModify: false })
                    .catch(err => console.log(err))
                    .then(() => {
                        console.log(" All updated")
                        requestModel.findOneAndUpdate({ request: result.request }, { comments: comments }, { useFindAndModify: false })
                            .catch(err => console.log(err))
                            .then((result) => {
                                console.log(" Single updated")
                            })
                    })
            }
            res.redirect('/feed')
        })
})

app.post('/newLoginComment/:id', (req, res) => {
    allPostModel.findById(req.params.id)
        .then((result) => {
            if (result.comments === undefined) {
                let comments = [req.body]
                comments.author = req.user.firstName
                comments.author_url = req.user.picture
                allPostModel.findByIdAndUpdate({ _id: req.params.id }, { comments: comments }, { useFindAndModify: false })
                    .catch(err => console.log(err))
                    .then(() => {
                        console.log("Comment posted")
                    })
            } else {
                let comments = result.comments
                let newComment = req.body
                newComment.author = req.user.firstName
                newComment.author_url = req.user.picture
                comments.push(newComment)
                allPostModel.findByIdAndUpdate({ _id: req.params.id }, { comments: comments }, { useFindAndModify: false })
                    .catch(err => console.log(err))
                    .then(() => {
                        console.log("Comment updated")
                    })
            }
            res.redirect('/feed')
        })
})

app.post('/newProjectComment/:id', (req, res) => {
    allPostModel.findById(req.params.id)
        .then((result) => {
            if (result.comments === undefined) {
                let comments = [req.body]
                comments.author = req.user.firstName
                comments.author_url = req.user.picture
                allPostModel.findByIdAndUpdate({ _id: req.params.id }, { comments: comments }, { useFindAndModify: false })
                    .catch(err => console.log(err))
                    .then(() => {
                        console.log("Comment posted")
                    })
            } else {
                let comments = result.comments
                let newComment = req.body
                newComment.author = req.user.firstName
                newComment.author_url = req.user.picture
                comments.push(newComment)
                allPostModel.findByIdAndUpdate({ _id: req.params.id }, { comments: comments }, { useFindAndModify: false })
                    .catch(err => console.log(err))
                    .then(() => {
                        console.log("Comment updated")
                    })
            }
            res.redirect('/feed')
        })
})

app.post('/newRequestComment/:id', (req, res) => {
    requestModel.findById(req.params.id)
        .then((result) => {
            if (result.comments === undefined) {
                let comments = [req.body]
                comments.author = req.user.firstName
                comments.author_url = req.user.picture
                requestModel.findByIdAndUpdate({ _id: req.params.id }, { comments: comments }, { useFindAndModify: false })
                    .catch(err => console.log(err))
                    .then(() => {
                        console.log(" All updated")
                        allPostModel.findOneAndUpdate({ request: result.request }, { comments: comments }, { useFindAndModify: false })
                            .catch(err => console.log(err))
                            .then(() => {
                                console.log(" Single updated")
                            })
                    })
            } else {
                let comments = result.comments
                let newComment = req.body
                newComment.author = req.user.firstName
                newComment.author_url = req.user.picture
                comments.push(newComment)
                requestModel.findByIdAndUpdate({ _id: req.params.id }, { comments: comments }, { useFindAndModify: false })
                    .catch(err => console.log(err))
                    .then(() => {
                        console.log(" All updated")
                        allPostModel.findOneAndUpdate({ request: result.request }, { comments: comments }, { useFindAndModify: false })
                            .catch(err => console.log(err))
                            .then((result) => {
                                console.log(" Single updated")
                            })
                    })
            }
            res.redirect('/newPost')
        })
})

const checkAuth = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.render('login')
    }
}

app.get('/', checkAuth, (req, res) => {
    res.redirect('/feed')
})
app.get('/auth/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})
app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/intro')
})
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/intro', (req, res) => {
    if (req.user === undefined) {
        profileModel.find()
            .then((result) => {
                res.render('intro', { user: result[result.length - 1] })
            })
    } else {
        res.redirect('/feed')
    }
})

app.post('/updateIntro/:id', (req, res) => {
    profileModel.findOneAndUpdate({ googleId: req.params.id }, { intro: req.body.intro, picture: req.body.picture, strength: req.body.strength, github: req.body.github, linkedin: req.body.linkedin, xing: req.body.xing }, { useFindAndModify: false })
        .catch(err => console.log(err))
        .then(() => {

            allPostModel.findOneAndUpdate({ googleId: req.params.id }, { intro: req.body.intro, picture: req.body.picture, strength: req.body.strength, github: req.body.github, linkedin: req.body.linkedin, xing: req.body.xing }, { useFindAndModify: false })
                .catch(err => console.log(err))
                .then((result) => {
                    console.log(" User updated")
                    res.redirect('/feed')
                })
        })
})