const mongoose = require('mongoose')
const Schema = mongoose.Schema

const profileModelSchema = new Schema({
    googleId: String,
    firstName: String,
    lastName: String,
    email: String,
    picture: String,
    intro: String,
    strength: String,
    github: String,
    linkedin: String,
    xing: String,
}, { timestamps: true })

const profileModel = mongoose.model('profile', profileModelSchema)
module.exports = profileModel