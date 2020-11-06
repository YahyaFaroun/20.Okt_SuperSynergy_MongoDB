require("dotenv").config()
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const allPostModel = require("../models/allPostsModel");
const profileModel = require('../models/profileModel')

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    profileModel.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3100/auth/google/callback"
},
    (accessToken, refreshToken, profile, done) => {
        profileModel.find({ googleId: profile.id }).then((user) => {
            if (user.length > 0) {
                console.log(`Welcome back ${profile.name.givenName}`)
                done(null, user)
            } else {
                new profileModel({
                    googleId: profile.id,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                }).save()
                    .then(() => {
                        new allPostModel({
                            type: 'profile',
                            googleId: profile.id,
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: profile.emails[0].value,
                        }).save()
                            .then(() => {
                                console.log('User created')
                                done(null, user)
                            })
                    })
            }
        })
    }
));
